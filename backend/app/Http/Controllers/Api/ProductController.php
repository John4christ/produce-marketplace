<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Policies\ProductPolicy;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request): JsonResponse
    {
        $isFarmerOrAdmin = $request->user() && ($request->user()->hasRole('farmer') || $request->user()->hasRole('admin'));

        $query = Product::query()
            ->with(['farmer', 'category', 'images'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->input('category_id'));
            })
            ->when($request->filled('farmer_id'), function ($query) use ($request) {
                $query->where('farmer_id', $request->input('farmer_id'));
            })
            ->when($request->filled('min_price'), function ($query) use ($request) {
                $query->where('price', '>=', $request->input('min_price'));
            })
            ->when($request->filled('max_price'), function ($query) use ($request) {
                $query->where('price', '<=', $request->input('max_price'));
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->input('status'));
            })
            ->when($request->filled('unit'), function ($query) use ($request) {
                $query->where('unit', $request->input('unit'));
            })
            ->when($request->boolean('my_products'), function ($query) {
                $query->where('farmer_id', Auth::id());
            });

        if (!$request->filled('status') && !$isFarmerOrAdmin) {
$query->where('status', 'approved');        }

        if (!$isFarmerOrAdmin) {
            $query->whereHas('farmer', fn ($q) => $q->where('status', User::STATUS_ACTIVE));
        }

        $perPage = $request->integer('per_page', 15);
        $products = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => new ProductCollection($products),
        ]);
    }

    public function store(ProductRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $validated['farmer_id'] = $request->user()->id;
$validated['status'] = 'pending';
        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            $this->handleImageUploads($product, $request->file('images'));
        }

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully.',
            'data' => new ProductResource($product->load('farmer', 'category', 'images')),
        ], 201);
    }

    public function show(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();
        $isOwner = $user && $product->farmer_id === $user->id;

        if ($product->farmer && !$product->farmer->isActive() && !$isOwner) {
            abort(404, 'Product not found.');
        }

        return response()->json([
            'success' => true,
            'data' => new ProductResource($product->load('farmer', 'category', 'images')),
        ]);
    }

    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        $this->authorize('update', $product);

        $validated = $request->validated();

        // Re-editing a reviewed product sends it back into the admin approval queue.
        if (in_array($product->status, ['approved', 'rejected'], true)) {
            $validated['status'] = 'pending';
            $validated['rejection_reason'] = null;
            $validated['approved_by'] = null;
            $validated['approved_at'] = null;
        }

        $product->update($validated);

        if ($request->hasFile('images')) {
            $this->handleImageUploads($product, $request->file('images'));
        }

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'data' => new ProductResource($product->load('farmer', 'category', 'images')),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->authorize('delete', $product);

        $product->images()->delete();

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.',
        ]);
    }

    public function approve(Request $request, Product $product): JsonResponse
    {
        if ($product->status === 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'This product is already approved.',
            ], 422);
        }

        $product->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'rejection_reason' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product approved successfully.',
            'data' => new ProductResource($product->load('farmer', 'category', 'images')),
        ]);
    }

    public function reject(Request $request, Product $product): JsonResponse
    {
        if ($product->status === 'rejected') {
            return response()->json([
                'success' => false,
                'message' => 'This product is already rejected.',
            ], 422);
        }

        $validated = $request->validate([
            'rejection_reason' => ['nullable', 'string', 'max:500'],
        ]);

        $product->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product rejected successfully.',
            'data' => new ProductResource($product->load('farmer', 'category', 'images')),
        ]);
    }

    private function handleImageUploads(Product $product, array $images): void
    {
        $existingCount = $product->images()->count();
        $maxAllowed = 10 - $existingCount;

        if ($maxAllowed <= 0) {
            throw ValidationException::withMessages([
                'images' => ['Product already has the maximum of 10 images.'],
            ]);
        }

        $images = array_slice($images, 0, $maxAllowed);
        $maxSortOrder = $product->images()->max('sort_order') ?? -1;

        foreach ($images as $index => $image) {
            $path = $image->store('products', 'public');

            $product->images()->create([
                'image_path' => $path,
                'alt_text' => $product->name,
                'sort_order' => $maxSortOrder + $index + 1,
            ]);
        }
    }
}

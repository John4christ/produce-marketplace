<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Policies\ProductPolicy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(['farmer', 'category', 'images'])
            ->when($request->filled('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->filled('category_id'), function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->filled('farmer_id'), function ($query, $farmerId) {
                $query->where('farmer_id', $farmerId);
            })
            ->when($request->filled('min_price'), function ($query, $minPrice) {
                $query->where('price', '>=', $minPrice);
            })
            ->when($request->filled('max_price'), function ($query, $maxPrice) {
                $query->where('price', '<=', $maxPrice);
            })
            ->when($request->filled('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->filled('unit'), function ($query, $unit) {
                $query->where('unit', $unit);
            })
            ->when($request->boolean('my_products'), function ($query) {
                $query->where('farmer_id', Auth::id());
            });

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

    public function show(Product $product): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new ProductResource($product->load('farmer', 'category', 'images')),
        ]);
    }

    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        $this->authorize('update', $product);

        $validated = $request->validated();

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

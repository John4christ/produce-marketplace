<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\ReviewCollection;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Policies\ReviewPolicy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(Request $request, Product $product): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $reviews = Review::forProduct($product->id)
            ->with('user')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        $averageRating = Review::where('product_id', $product->id)->avg('rating');
        $reviewCount = Review::where('product_id', $product->id)->count();

        return response()->json([
            'success' => true,
            'data' => new ReviewCollection($reviews),
            'meta' => [
                'average_rating' => round($averageRating, 1),
                'review_count' => $reviewCount,
            ],
        ]);
    }

    public function store(ReviewRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $existingReview = Review::where('product_id', $validated['product_id'])
            ->where('user_id', $user->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this product.',
            ], 422);
        }

        $hasPurchased = OrderItem::whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->whereIn('status', ['delivered', 'shipped', 'processing']);
            })
            ->where('product_id', $validated['product_id'])
            ->exists();

        if (!$hasPurchased && !$user->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'You can only review products you have purchased.',
            ], 403);
        }

        $review = Review::create([
            'product_id' => $validated['product_id'],
            'user_id' => $user->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'title' => $validated['title'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review added successfully.',
            'data' => new ReviewResource($review->load('user', 'product')),
        ], 201);
    }

    public function update(ReviewRequest $request, Review $review): JsonResponse
    {
        $this->authorize('update', $review);

        $validated = $request->validated();

        $review->update([
            'product_id' => $validated['product_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'title' => $validated['title'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully.',
            'data' => new ReviewResource($review->load('user', 'product')),
        ]);
    }

    public function destroy(Request $request, Review $review): JsonResponse
    {
        $this->authorize('delete', $review);

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully.',
        ]);
    }
}

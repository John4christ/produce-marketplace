<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Policies\CategoryPolicy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = Category::query()
            ->with('parent')
            ->when($request->filled('parent_id'), fn ($query, $parentId) => $query->where('parent_id', $parentId))
            ->when($request->filled('search'), fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ]);
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $validated['created_by'] = Auth::id();

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully.',
            'data' => new CategoryResource($category->load('parent')),
        ], 201);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category->load('parent', 'children')),
        ]);
    }

    public function update(CategoryRequest $request, Category $category): JsonResponse
    {
        $this->authorize('update', $category);

        $validated = $request->validated();

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully.',
            'data' => new CategoryResource($category->load('parent')),
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        $this->authorize('delete', $category);

        if ($category->children()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category with subcategories. Reassign them first.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully.',
        ]);
    }
}

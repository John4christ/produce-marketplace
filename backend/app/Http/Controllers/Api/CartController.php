<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cart = $request->user()->cart()->with('items.product')->firstOrCreate(
            ['user_id' => $request->user()->id]
        );

        return response()->json([
            'success' => true,
            'data' => new CartResource($cart),
        ]);
    }

    public function store(CartItemRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $request->user();
        $cart = $user->cart()->firstOrCreate(['user_id' => $user->id]);

        $product = Product::where('id', $validated['product_id'])
            ->where('status', 'published')
            ->firstOrFail();

        if ($product->quantity_available < $validated['quantity']) {
            return response()->json([
                'success' => false,
                'message' => 'Requested quantity exceeds available stock.',
                'available' => $product->quantity_available,
            ], 422);
        }

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $quantity = $cartItem->quantity + $validated['quantity'];
            if ($product->quantity_available < $quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Requested quantity exceeds available stock.',
                    'available' => $product->quantity_available,
                ], 422);
            }

            $cartItem->update([
                'quantity' => $quantity,
                'unit_price' => $product->price,
            ]);
        } else {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
                'unit_price' => $product->price,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart.',
            'data' => new CartResource($cart->load('items.product')),
        ], 201);
    }

    public function update(CartItemRequest $request, CartItem $cartItem): JsonResponse
    {
        $user = $request->user();

        if ($cartItem->cart->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validated();

        $product = Product::where('id', $validated['product_id'])
            ->where('status', 'published')
            ->firstOrFail();

        if ($product->quantity_available < $validated['quantity']) {
            return response()->json([
                'success' => false,
                'message' => 'Requested quantity exceeds available stock.',
                'available' => $product->quantity_available,
            ], 422);
        }

        $cartItem->update([
            'product_id' => $product->id,
            'quantity' => $validated['quantity'],
            'unit_price' => $product->price,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cart item updated.',
            'data' => new CartResource($cartItem->cart->load('items.product')),
        ]);
    }

    public function destroy(Request $request, CartItem $cartItem): JsonResponse
    {
        $user = $request->user();

        if ($cartItem->cart->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart.',
            'data' => new CartResource($cartItem->cart->load('items.product')),
        ]);
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $request->user()->cart()->with('items')->firstOrCreate(
            ['user_id' => $request->user()->id]
        );

        $cart->items()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared.',
            'data' => new CartResource($cart->load('items.product')),
        ]);
    }
}

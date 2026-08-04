<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use App\Policies\OrderPolicy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::query()
            ->with(['user', 'items.product', 'items.farmer', 'statusHistory.creator'])
            ->when($request->filled('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->boolean('my_orders'), function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->when($request->user()->hasRole('admin'), function ($query) use ($request) {
                if ($request->filled('user_id')) {
                    $query->where('user_id', $request->integer('user_id'));
                }
            })
            ->orderByDesc('created_at');

        $perPage = $request->integer('per_page', 15);
        $orders = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => new OrderCollection($orders),
        ]);
    }

    public function store(OrderRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $cart = $user->cart()->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Your cart is empty.',
            ], 422);
        }

        $shippingCost = match ($validated['delivery_method']) {
            'express' => 8.99,
            'pickup' => 0.00,
            default => 4.99,
        };

        $subtotal = 0;
        $orderItems = [];

        foreach ($cart->items as $cartItem) {
            $product = $cartItem->product;

            if (!$product || $product->status !== 'published') {
                $productName = $product?->name ?? 'Item';
                return response()->json([
                    'success' => false,
                    'message' => "Product '{$productName}' is no longer available.",
                    'product_id' => $cartItem->product_id,
                ], 422);
            }

            if ($product->quantity_available < $cartItem->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Insufficient stock for '{$product->name}'. Available: {$product->quantity_available}.",
                    'product_id' => $product->id,
                    'available' => $product->quantity_available,
                ], 422);
            }

            $lineTotal = $cartItem->quantity * $cartItem->unit_price;
            $subtotal += $lineTotal;

            $orderItems[] = [
                'product_id' => $product->id,
                'farmer_id' => $product->farmer_id,
                'product_name' => $product->name,
                'product_unit' => $product->unit,
                'quantity' => $cartItem->quantity,
                'unit_price' => $cartItem->unit_price,
                'subtotal' => $lineTotal,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $tax = 0.00;
        $total = $subtotal + $tax + $shippingCost;

        return DB::transaction(function () use ($cart, $user, $validated, $shippingCost, $subtotal, $tax, $total, $orderItems) {
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'user_id' => $user->id,
                'status' => 'pending',
                'delivery_method' => $validated['delivery_method'],
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'shipping_address' => $validated['shipping_address'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($orderItems as $orderItem) {
                $orderItem['order_id'] = $order->id;
                OrderItem::create($orderItem);
            }

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => 'pending',
                'notes' => 'Order placed successfully.',
                'created_by' => $user->id,
            ]);

            foreach ($cart->items as $cartItem) {
                $product = $cartItem->product;
                $product->decrement('quantity_available', $cartItem->quantity);
            }

            $cart->items()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully.',
                'data' => new OrderResource($order->load('items.product', 'items.farmer', 'statusHistory.creator', 'payments')),
            ], 201);
        });
    }

    public function show(Order $order): JsonResponse
    {
        $user = Auth::user();

        $canViewAsFarmer = $user->hasRole('farmer') && $order->items()->where('farmer_id', $user->id)->exists();

        if ($user->hasRole('admin') || $user->id === $order->user_id || $canViewAsFarmer) {
            return response()->json([
                'success' => true,
                'data' => new OrderResource($order->load('items.product.farmer', 'items.farmer', 'statusHistory.creator', 'payments')),
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthorized.',
        ], 403);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $user = $request->user();

        if ($user->hasRole('farmer')) {
            $isFarmerForOrder = $order->items()->where('farmer_id', $user->id)->exists();
            if (!$isFarmerForOrder) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized.',
                ], 403);
            }
        } elseif (!$user->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validated();

        $oldStatus = $order->status;
        $order->update(['status' => $validated['status']]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? "Status changed from {$oldStatus} to {$validated['status']}",
            'created_by' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully.',
            'data' => new OrderResource($order->load('items.product.farmer', 'items.farmer', 'statusHistory.creator')),
        ]);
    }
}

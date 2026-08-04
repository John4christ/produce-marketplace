<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FarmerController extends Controller
{
    public function products(Request $request): JsonResponse
    {
        $products = $request->user()
            ->products()
            ->with(['farmer', 'category', 'images'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($products),
        ]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        $farmerId = $user->id;

        $activeListings = Product::where('farmer_id', $farmerId)->count();
        $publishedListings = Product::where('farmer_id', $farmerId)->where('status', 'published')->count();

        $pendingOrders = Order::whereHas('items', function ($query) use ($farmerId) {
            $query->where('farmer_id', $farmerId);
        })->where('status', 'pending')->count();

        $processingOrders = Order::whereHas('items', function ($query) use ($farmerId) {
            $query->where('farmer_id', $farmerId);
        })->where('status', 'processing')->count();

        $shippedOrders = Order::whereHas('items', function ($query) use ($farmerId) {
            $query->where('farmer_id', $farmerId);
        })->where('status', 'shipped')->count();

        $deliveredOrders = Order::whereHas('items', function ($query) use ($farmerId) {
            $query->where('farmer_id', $farmerId);
        })->where('status', 'delivered')->count();

        $monthlyRevenue = Payment::where('status', 'success')
            ->whereHas('order.items', function ($query) use ($farmerId) {
                $query->where('farmer_id', $farmerId);
            })
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount');

        $totalRevenue = Payment::where('status', 'success')
            ->whereHas('order.items', function ($query) use ($farmerId) {
                $query->where('farmer_id', $farmerId);
            })
            ->sum('amount');

        $pendingPayout = Payment::where('status', 'pending')
            ->whereHas('order.items', function ($query) use ($farmerId) {
                $query->where('farmer_id', $farmerId);
            })
            ->sum('amount');

        $newBuyers = Order::whereHas('items', function ($query) use ($farmerId) {
            $query->where('farmer_id', $farmerId);
        })->whereMonth('created_at', now()->month)
          ->whereYear('created_at', now()->year)
          ->distinct('user_id')
          ->count('user_id');

        $recentOrders = Order::whereHas('items', function ($query) use ($farmerId) {
            $query->where('farmer_id', $farmerId);
        })
            ->with(['user', 'items.product', 'items.farmer'])
            ->latest()
            ->limit(5)
            ->get();

        $recentProducts = ProductResource::collection($user->products()->with(['farmer', 'category', 'images'])->latest()->limit(5)->get());

        return response()->json([
            "success" => true,
            "data" => [
                "stats" => [
                    "monthlyRevenue" => (float) $monthlyRevenue,
                    "activeListings" => (int) $publishedListings,
                    "pendingOrders" => (int) $pendingOrders,
                    "newBuyers" => (int) $newBuyers,
                    "total_orders" => (int) ($pendingOrders + $processingOrders + $shippedOrders + $deliveredOrders),
                ],

                "wallet" => [
                    "balance" => (float) $totalRevenue,
                    "pending" => (float) $pendingPayout,
                    "earnedThisMonth" => (float) $monthlyRevenue,
                ],

                "orders" => $recentOrders,

                "products" => $recentProducts,

                "notifications" => [],

                "user" => $user,
            ]
        ]);
    }
}
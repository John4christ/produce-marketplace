<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OrderUpdateRequest;
use App\Http\Requests\Admin\ProductUpdateRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Http\Resources\Admin\DashboardStatsResource;
use App\Http\Resources\Admin\OrderResource;
use App\Http\Resources\Admin\ProductResource;
use App\Http\Resources\Admin\UserResource;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $from = $request->filled('from') ? Carbon::parse($request->input('from'))->startOfDay() : null;
        $to = $request->filled('to') ? Carbon::parse($request->input('to'))->endOfDay() : null;

        $query = $from && $to
            ? fn ($q) => $q->whereBetween('created_at', [$from, $to])
            : fn ($q) => $q;

        $stats = [
            'users' => [
                'total' => User::count(),
                'admins' => User::whereHas('roles', fn ($q) => $q->where('slug', 'admin'))->count(),
                'farmers' => User::whereHas('roles', fn ($q) => $q->where('slug', 'farmer'))->count(),
                'buyers' => User::whereHas('roles', fn ($q) => $q->where('slug', 'buyer'))->count(),
                'new_today' => User::whereDate('created_at', today())->count(),
            ],
            'products' => [
                'total' => Product::count(),
                'published' => Product::where('status', 'published')->count(),
                'draft' => Product::where('status', 'draft')->count(),
                'archived' => Product::where('status', 'archived')->count(),
            ],
            'orders' => [
                'total' => Order::count(),
                'pending' => Order::where('status', 'pending')->count(),
                'processing' => Order::where('status', 'processing')->count(),
                'shipped' => Order::where('status', 'shipped')->count(),
                'delivered' => Order::where('status', 'delivered')->count(),
                'cancelled' => Order::where('status', 'cancelled')->count(),
                'total_revenue' => Payment::where('status', 'success')->sum('amount'),
            ],
            'recent_orders' => Order::with('user')->latest()->limit(5)->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => new DashboardStatsResource($stats),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $query = User::query()
            ->with('roles')
            ->when($request->filled('search'), function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('role'), function ($query, $role) {
                $query->whereHas('roles', fn ($q) => $q->where('slug', $role));
            });

        if ($request->input('sort') === 'oldest') {
            $query->orderBy('created_at', 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->integer('per_page', 15);
        $users = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function showUser(User $user): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($user->load('roles')),
        ]);
    }

    public function updateUser(UserUpdateRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();

        if (isset($validated['name'])) {
            $user->update(['name' => $validated['name']]);
        }

        if (isset($validated['email'])) {
            $user->update(['email' => $validated['email']]);
        }

        if (isset($validated['role'])) {
            $role = \App\Models\Role::where('slug', $validated['role'])->firstOrFail();
            $user->roles()->sync([$role->id]);
        }

        if (isset($validated['email_verified_at'])) {
            $user->update([
                'email_verified_at' => $validated['email_verified_at'] ? now() : null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => new UserResource($user->load('roles')),
        ]);
    }

    public function deleteUser(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account.',
            ], 403);
        }

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();

            $user->notifications()->delete();

            DB::table('sessions')->where('user_id', $user->id)->delete();

            $user->roles()->detach();

            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.',
        ]);
    }

    public function products(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(['farmer', 'category'])
            ->when($request->filled('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->filled('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->filled('farmer_id'), function ($query, $farmerId) {
                $query->where('farmer_id', $farmerId);
            })
            ->orderByDesc('created_at');

        $perPage = $request->integer('per_page', 15);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($products),
        ]);
    }

    public function updateProduct(ProductUpdateRequest $request, Product $product): JsonResponse
    {
        $validated = $request->validated();

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'data' => new ProductResource($product->load('farmer', 'category')),
        ]);
    }

    public function deleteProduct(Product $product): JsonResponse
    {
        $product->images()->delete();
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.',
        ]);
    }

    public function orders(Request $request): JsonResponse
    {
        $query = Order::query()
            ->with(['user', 'items'])
            ->when($request->filled('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->filled('user_id'), function ($query, $userId) {
                $query->where('user_id', $userId);
            })
            ->orderByDesc('created_at');

        $perPage = $request->integer('per_page', 15);
        $orders = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => OrderResource::collection($orders),
        ]);
    }

    public function showOrder(Order $order): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new OrderResource($order->load('user', 'items.product', 'items.farmer')),
        ]);
    }

    public function updateOrder(OrderUpdateRequest $request, Order $order): JsonResponse
    {
        $validated = $request->validated();

        $order->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully.',
            'data' => new OrderResource($order->load('user', 'items')),
        ]);
    }

    public function salesReport(Request $request): JsonResponse
    {
        $from = $request->filled('from') ? Carbon::parse($request->input('from'))->startOfDay() : Carbon::now()->subDays(30);
        $to = $request->filled('to') ? Carbon::parse($request->input('to'))->endOfDay() : Carbon::now();

        $sales = Order::whereBetween('created_at', [$from, $to])
            ->whereIn('status', ['processing', 'shipped', 'delivered'])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as order_count'),
                DB::raw('SUM(total) as total_sales')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $totalSales = $sales->sum('total_sales');
        $totalOrders = $sales->sum('order_count');

        return response()->json([
            'success' => true,
            'data' => [
                'period' => [
                    'from' => $from->toDateString(),
                    'to' => $to->toDateString(),
                ],
                'summary' => [
                    'total_sales' => $totalSales,
                    'total_orders' => $totalOrders,
                    'average_order_value' => $totalOrders > 0 ? round($totalSales / $totalOrders, 2) : 0,
                ],
                'daily' => $sales,
            ],
        ]);
    }

    public function topProducts(Request $request): JsonResponse
    {
        $limit = $request->integer('limit', 10);

        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereIn('orders.status', ['delivered', 'processing', 'shipped'])
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.subtotal) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $topProducts,
        ]);
    }

    public function topFarmers(Request $request): JsonResponse
    {
        $limit = $request->integer('limit', 10);

        $topFarmers = DB::table('order_items')
            ->join('users', 'order_items.farmer_id', '=', 'users.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereIn('orders.status', ['delivered', 'processing', 'shipped'])
            ->select(
                'users.id',
                'users.name',
                DB::raw('COUNT(DISTINCT orders.id) as total_orders'),
                DB::raw('SUM(order_items.subtotal) as total_revenue')
            )
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $topFarmers,
        ]);
    }
}

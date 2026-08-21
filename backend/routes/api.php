<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FarmerController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])
    ->prefix('farmer')
    ->group(function () {

        Route::get('/dashboard', [FarmerController::class, 'dashboard'])
            ->middleware(CheckRole::class . ':farmer');

        Route::get('/products', [FarmerController::class, 'products'])
            ->middleware(CheckRole::class . ':farmer');
    });

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    // Public
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware('throttle:5,1');

    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1');

    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
        ->middleware('throttle:5,1');

    Route::post('/reset-password', [AuthController::class, 'resetPassword'])
        ->middleware('throttle:5,1');

    Route::get('/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware('throttle:10,1')
        ->name('verification.verify');

    Route::post('/resend-verification', [AuthController::class, 'resendVerification'])
        ->middleware('throttle:5,1');

    // Protected
    Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('throttle:5,1');
    Route::get('/me', [AuthController::class, 'me'])->middleware('throttle:10,1');

    Route::match(['post', 'put'], '/profile', [AuthController::class, 'updateProfile']);
});

});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'throttle:60,1'])
    ->prefix('admin')
    ->group(function () {

        Route::get('/dashboard', [AdminController::class, 'dashboard'])
            ->middleware(CheckRole::class . ':admin');

        Route::get('/users', [AdminController::class, 'users'])
            ->middleware(CheckRole::class . ':admin');

        Route::get('/users/{user}', [AdminController::class, 'showUser'])
            ->middleware(CheckRole::class . ':admin');

        Route::put('/users/{user}', [AdminController::class, 'updateUser'])
            ->middleware(CheckRole::class . ':admin');

        Route::post('/users/{user}/deactivate', [AdminController::class, 'deactivateUser'])
            ->middleware(CheckRole::class . ':admin');

        Route::post('/users/{user}/reactivate', [AdminController::class, 'reactivateUser'])
            ->middleware(CheckRole::class . ':admin');

        Route::get('/products', [AdminController::class, 'products'])
            ->middleware(CheckRole::class . ':admin');

        Route::put('/products/{product}', [AdminController::class, 'updateProduct'])
            ->middleware(CheckRole::class . ':admin');

        Route::delete('/products/{product}', [AdminController::class, 'deleteProduct'])
            ->middleware(CheckRole::class . ':admin');

        Route::get('/orders', [AdminController::class, 'orders'])
            ->middleware(CheckRole::class . ':admin');

        Route::get('/orders/{order}', [AdminController::class, 'showOrder'])
            ->middleware(CheckRole::class . ':admin');

        Route::put('/orders/{order}', [AdminController::class, 'updateOrder'])
            ->middleware(CheckRole::class . ':admin');

        Route::get('/reports/sales', [AdminController::class, 'salesReport'])
            ->middleware(CheckRole::class . ':admin');

        Route::get('/reports/top-products', [AdminController::class, 'topProducts'])
            ->middleware(CheckRole::class . ':admin');

        Route::get('/reports/top-farmers', [AdminController::class, 'topFarmers'])
            ->middleware(CheckRole::class . ':admin');

    });

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

Route::middleware('throttle:60,1')
    ->prefix('categories')
    ->group(function () {

        Route::get('/', [App\Http\Controllers\Api\CategoryController::class, 'index']);
        Route::get('/{category}', [App\Http\Controllers\Api\CategoryController::class, 'show']);

        Route::middleware('auth:sanctum')->group(function () {

            Route::post('/', [App\Http\Controllers\Api\CategoryController::class, 'store'])
                ->middleware(CheckRole::class . ':admin|farmer');

            Route::put('/{category}', [App\Http\Controllers\Api\CategoryController::class, 'update'])
                ->middleware(CheckRole::class . ':admin|farmer');

            Route::delete('/{category}', [App\Http\Controllers\Api\CategoryController::class, 'destroy'])
                ->middleware(CheckRole::class . ':admin');

        });

    });

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/

Route::middleware('throttle:60,1')
    ->prefix('products')
    ->group(function () {

        Route::get('/', [App\Http\Controllers\Api\ProductController::class, 'index']);
        Route::get('/{product}', [App\Http\Controllers\Api\ProductController::class, 'show']);

        Route::middleware('auth:sanctum')->group(function () {

            Route::post('/', [App\Http\Controllers\Api\ProductController::class, 'store'])
                ->middleware(CheckRole::class . ':farmer|admin');

            Route::put('/{product}', [App\Http\Controllers\Api\ProductController::class, 'update'])
                ->middleware(CheckRole::class . ':farmer|admin');

            Route::delete('/{product}', [App\Http\Controllers\Api\ProductController::class, 'destroy'])
                ->middleware(CheckRole::class . ':farmer|admin');

            Route::patch('/{product}/approve', [App\Http\Controllers\Api\ProductController::class, 'approve'])
                ->middleware(CheckRole::class . ':admin');

            Route::patch('/{product}/reject', [App\Http\Controllers\Api\ProductController::class, 'reject'])
                ->middleware(CheckRole::class . ':admin');

        });

    });

/*
|--------------------------------------------------------------------------
| Cart
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'throttle:60,1'])
    ->prefix('cart')
    ->group(function () {

        Route::get('/', [App\Http\Controllers\Api\CartController::class, 'index']);
        Route::post('/items', [App\Http\Controllers\Api\CartController::class, 'store']);
        Route::put('/items/{cart_item}', [App\Http\Controllers\Api\CartController::class, 'update']);
        Route::delete('/items/{cart_item}', [App\Http\Controllers\Api\CartController::class, 'destroy']);
        Route::delete('/', [App\Http\Controllers\Api\CartController::class, 'clear']);

    });

/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'throttle:60,1'])
    ->prefix('orders')
    ->group(function () {

        Route::get('/', [App\Http\Controllers\Api\OrderController::class, 'index']);
        Route::post('/', [App\Http\Controllers\Api\OrderController::class, 'store']);
        Route::get('/{order}', [App\Http\Controllers\Api\OrderController::class, 'show']);
        Route::put('/{order}/status', [App\Http\Controllers\Api\OrderController::class, 'updateStatus']);

    });

/*
|--------------------------------------------------------------------------
| Payments
|--------------------------------------------------------------------------
*/

Route::middleware('throttle:60,1')
    ->prefix('payments')
    ->group(function () {

        Route::post('/initialize', [App\Http\Controllers\Api\PaymentController::class, 'initialize'])
            ->middleware('auth:sanctum');

        Route::post('/verify', [App\Http\Controllers\Api\PaymentController::class, 'verify'])
            ->middleware('auth:sanctum');

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/', [App\Http\Controllers\Api\PaymentController::class, 'index']);
        });

    });

/*
|--------------------------------------------------------------------------
| Reviews
|--------------------------------------------------------------------------
*/

Route::middleware('throttle:60,1')
    ->prefix('products/{product}/reviews')
    ->group(function () {

        Route::get('/', [App\Http\Controllers\Api\ReviewController::class, 'index']);

        Route::middleware('auth:sanctum')->group(function () {

            Route::post('/', [App\Http\Controllers\Api\ReviewController::class, 'store']);
            Route::put('/{review}', [App\Http\Controllers\Api\ReviewController::class, 'update']);
            Route::delete('/{review}', [App\Http\Controllers\Api\ReviewController::class, 'destroy']);

        });

    });

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'throttle:60,1'])
    ->prefix('notifications')
    ->group(function () {

        Route::get('/', [App\Http\Controllers\Api\NotificationController::class, 'index']);
        Route::get('/unread-count', [App\Http\Controllers\Api\NotificationController::class, 'unreadCount']);
        Route::get('/{notification}', [App\Http\Controllers\Api\NotificationController::class, 'show']);
        Route::put('/{notification}/read', [App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
        Route::put('/read-all', [App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
        Route::delete('/{notification}', [App\Http\Controllers\Api\NotificationController::class, 'destroy']);

    });
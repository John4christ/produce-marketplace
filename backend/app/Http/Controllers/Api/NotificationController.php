<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationCollection;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->when($request->filled('type'), function ($query, $type) {
                $query->where('data->type', $type);
            })
            ->when($request->boolean('unread'), function ($query) {
                $query->whereNull('read_at');
            })
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => new NotificationCollection($notifications),
        ]);
    }

    public function show(Request $request, string $notification): JsonResponse
    {
        $notificationModel = $request->user()->notifications()->where('id', $notification)->firstOrFail();

        if (is_null($notificationModel->read_at)) {
            $notificationModel->markAsRead();
        }

        return response()->json([
            'success' => true,
            'data' => new NotificationResource($notificationModel),
        ]);
    }

    public function markAsRead(Request $request, string $notification): JsonResponse
    {
        $notificationModel = $request->user()->notifications()->where('id', $notification)->firstOrFail();
        $notificationModel->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read.',
            'data' => new NotificationResource($notificationModel),
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->each(fn ($notification) => $notification->markAsRead());

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read.',
        ]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = $request->user()->unreadNotifications()->count();

        return response()->json([
            'success' => true,
            'data' => [
                'unread_count' => $count,
            ],
        ]);
    }

    public function destroy(Request $request, string $notification): JsonResponse
    {
        $notificationModel = $request->user()->notifications()->where('id', $notification)->firstOrFail();
        $notificationModel->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted successfully.',
        ]);
    }
}

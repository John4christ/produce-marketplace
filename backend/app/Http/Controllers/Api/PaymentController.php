<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InitializePaymentRequest;
use App\Http\Requests\VerifyPaymentRequest;
use App\Http\Resources\PaymentCollection;
use App\Http\Resources\PaymentResource;
use App\Models\Order;
use App\Models\Payment;
use App\Services\FlutterwaveService;
use App\Services\PaystackService;
use App\Services\PaymentServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use InvalidArgumentException;

class PaymentController extends Controller
{
    protected PaymentServiceInterface $service;

    public function __construct()
    {
        $provider = config('payments.default');

        $this->service = match ($provider) {
            'flutterwave' => app(FlutterwaveService::class),
            'paystack' => app(PaystackService::class),
            default => throw new InvalidArgumentException("Unsupported payment provider: {$provider}"),
        };
    }

    public function initialize(InitializePaymentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $request->user();
        $order = Order::where('id', $validated['order_id'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        if ($order->status === 'paid' || $order->status === 'processing') {
            return response()->json([
                'success' => false,
                'message' => 'This order has already been paid for.',
            ], 422);
        }

        $existingPending = Payment::where('order_id', $order->id)
            ->where('status', 'pending')
            ->exists();

        if ($existingPending) {
            return response()->json([
                'success' => false,
                'message' => 'A payment is already in progress for this order.',
            ], 422);
        }

        try {
            $result = $this->service->initialize($order, $validated['email']);

            return response()->json([
                'success' => true,
                'message' => 'Payment initialized successfully.',
                'data' => $result,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function verify(VerifyPaymentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $request->user();

        try {
            $result = $this->service->verify($validated['reference']);

            $payment = Payment::where('reference', $validated['reference'])->firstOrFail();

            if ($payment->user_id !== $user->id && !$user->hasRole('admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized.',
                ], 403);
            }

            $message = match ($result['status']) {
                'success' => 'Payment verified successfully.',
                'failed' => 'Payment failed.',
                default => 'Payment is pending.',
            };

            return response()->json([
                'success' => $result['status'] === 'success',
                'message' => $message,
                'data' => $result,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function index(Request $request): JsonResponse
    {
        $payments = Payment::query()
            ->with(['order', 'user'])
            ->when($request->filled('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->filled('order_id'), function ($query, $orderId) {
                $query->where('order_id', $orderId);
            })
            ->when(!$request->user()->hasRole('admin'), function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->when($request->filled('from'), function ($query, $from) {
                $query->whereDate('created_at', '>=', $from);
            })
            ->when($request->filled('to'), function ($query, $to) {
                $query->whereDate('created_at', '<=', $to);
            })
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => new PaymentCollection($payments),
        ]);
    }
}

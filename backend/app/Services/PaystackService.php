<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackService implements PaymentServiceInterface
{
    protected string $baseUrl;

    protected string $secretKey;

    public function __construct()
    {
        $this->baseUrl = config('payments.providers.paystack.base_url');
        $this->secretKey = config('payments.providers.paystack.secret_key');
    }

    public function initialize(Order $order, ?string $email = null, ?string $callbackUrl = null): array
    {
        $callbackUrl = $callbackUrl ?? config('payments.callback_url');

        $response = Http::withToken($this->secretKey)
            ->post($this->baseUrl . '/transaction/initialize', [
                'email' => $email ?? $order->user->email,
                'amount' => (int) ($order->total * 100),
                'currency' => $order->currency ?? 'NGN',
                'reference' => $this->generateReference($order),
                'callback_url' => $callbackUrl,
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_id' => $order->user_id,
                ],
            ]);

        if (!$response->successful()) {
            Log::error('Paystack initialization failed', [
                'order_id' => $order->id,
                'response' => $response->body(),
            ]);

            throw new Exception('Payment initialization failed. Please try again.');
        }

        $data = $response->json('data');

        $this->storePayment($order, $data['reference'], 'pending');

        return [
            'authorization_url' => $data['authorization_url'],
            'access_code' => $data['access_code'],
            'reference' => $data['reference'],
        ];
    }

    public function verify(string $reference): array
    {
        $response = Http::withToken($this->secretKey)
            ->get($this->baseUrl . '/transaction/verify/' . $reference);

        if (!$response->successful()) {
            throw new Exception('Payment verification failed.');
        }

        $data = $response->json('data');

        $payment = Payment::where('reference', $reference)->firstOrFail();

        $status = match ($data['status']) {
            'success' => 'success',
            'failed', 'cancelled' => 'failed',
            default => 'pending',
        };

        $payment->update([
            'status' => $status,
            'payment_method' => $data['channel'] ?? null,
            'metadata' => array_merge($payment->metadata ?? [], ['provider_response' => $data]),
        ]);

        if ($status === 'success') {
            $this->updateOrderStatus($payment->order, 'paid');
        }

        return [
            'status' => $status,
            'amount' => $data['amount'] / 100,
            'currency' => $data['currency'],
            'reference' => $data['reference'],
            'paid_at' => $data['paid_at'] ?? null,
            'channel' => $data['channel'] ?? null,
        ];
    }

    public function getTransactionHistory(string $userId, ?string $from = null, ?string $to = null): array
    {
        $query = Payment::where('user_id', $userId)
            ->where('provider', 'paystack')
            ->latest();

        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        return $query->get()->map(fn ($payment) => [
            'id' => $payment->id,
            'reference' => $payment->reference,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'status' => $payment->status,
            'payment_method' => $payment->payment_method,
            'order_id' => $payment->order_id,
            'order_number' => $payment->order->order_number ?? null,
            'created_at' => $payment->created_at,
        ])->toArray();
    }

    protected function generateReference(Order $order): string
    {
        return 'PMT-' . strtoupper($order->order_number) . '-' . now()->format('YmdHis');
    }

    protected function storePayment(Order $order, string $reference, string $status): Payment
    {
        return Payment::create([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'provider' => 'paystack',
            'reference' => $reference,
            'amount' => $order->total,
            'currency' => $order->currency ?? 'NGN',
            'status' => $status,
            'metadata' => ['order_number' => $order->order_number],
        ]);
    }

    protected function updateOrderStatus(Order $order, string $status): void
    {
        if ($order->status !== 'paid' && $order->status !== 'processing') {
            $order->update([
                'status' => $status,
                'paid_at' => $status === 'paid' ? now() : $order->paid_at,
            ]);

            \App\Models\OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => $status,
                'notes' => 'Payment verified successfully.',
                'created_by' => $order->user_id,
            ]);
        }
    }
}

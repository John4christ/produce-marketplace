<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FlutterwaveService implements PaymentServiceInterface
{
    protected string $baseUrl;

    protected string $secretKey;

    protected string $encryptionKey;

    public function __construct()
    {
        $this->baseUrl = config('payments.providers.flutterwave.base_url');
        $this->secretKey = config('payments.providers.flutterwave.secret_key');
        $this->encryptionKey = config('payments.providers.flutterwave.encryption_key');
    }

    public function initialize(Order $order, ?string $email = null, ?string $callbackUrl = null): array
    {
        $callbackUrl = $callbackUrl ?? config('payments.callback_url');

        $response = Http::withToken($this->secretKey)
            ->post($this->baseUrl . '/payments', [
                'tx_ref' => $this->generateReference($order),
                'amount' => number_format($order->total, 2, '.', ''),
                'currency' => $order->currency ?? 'NGN',
                'redirect_url' => $callbackUrl,
                'customer' => [
                    'email' => $email ?? $order->user->email,
                    'name' => $order->user->name,
                ],
                'meta' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_id' => $order->user_id,
                ],
            ]);

        if (!$response->successful()) {
            Log::error('Flutterwave initialization failed', [
                'order_id' => $order->id,
                'response' => $response->body(),
            ]);

            throw new Exception('Payment initialization failed. Please try again.');
        }

        $data = $response->json('data');

        $this->storePayment($order, $data['tx_ref'], 'pending');

        return [
            'authorization_url' => $data['link'],
            'reference' => $data['tx_ref'],
        ];
    }

    public function verify(string $reference): array
    {
        $response = Http::withToken($this->secretKey)
            ->get($this->baseUrl . '/transactions/' . $reference . '/verify');

        if (!$response->successful()) {
            throw new Exception('Payment verification failed.');
        }

        $data = $response->json('data');

        $payment = Payment::where('reference', $reference)->firstOrFail();

        $status = match ($data['status']) {
            'successful' => 'success',
            'failed', 'cancelled' => 'failed',
            default => 'pending',
        };

        $payment->update([
            'status' => $status,
            'payment_method' => $data['payment_type'] ?? null,
            'metadata' => array_merge($payment->metadata ?? [], ['provider_response' => $data]),
        ]);

        if ($status === 'success') {
            $this->updateOrderStatus($payment->order, 'processing');
        }

        return [
            'status' => $status,
            'amount' => $data['amount'],
            'currency' => $data['currency'],
            'reference' => $data['tx_ref'],
            'paid_at' => $data['created_at'] ?? null,
            'channel' => $data['payment_type'] ?? null,
        ];
    }

    public function getTransactionHistory(string $userId, ?string $from = null, ?string $to = null): array
    {
        $query = Payment::where('user_id', $userId)
            ->where('provider', 'flutterwave')
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
            'provider' => 'flutterwave',
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
            $order->update(['status' => $status]);

            \App\Models\OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => $status,
                'notes' => 'Payment verified successfully.',
                'created_by' => $order->user_id,
            ]);
        }
    }
}

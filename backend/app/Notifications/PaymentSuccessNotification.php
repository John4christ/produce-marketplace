<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentSuccessNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Payment $payment)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Payment Successful',
            'message' => "Your payment of {$this->payment->amount} {$this->payment->currency} for order #{$this->payment->order->order_number} was successful.",
            'type' => 'payment',
            'action_url' => url("/orders/{$this->payment->order_id}"),
        ];
    }
}

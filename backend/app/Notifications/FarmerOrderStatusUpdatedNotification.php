<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FarmerOrderStatusUpdatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order, public string $status)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Order Status Updated',
            'message' => "Order #{$this->order->order_number} status changed to {$this->status}.",
            'type' => 'order',
            'action_url' => url("/orders/{$this->order->id}"),
        ];
    }
}

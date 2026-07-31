<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FarmerReviewReceivedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Review $review)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'New Review Received',
            'message' => "Your product '{$this->review->product->name}' received a {$this->review->rating}-star review.",
            'type' => 'review',
            'action_url' => url("/products/{$this->review->product_id}"),
        ];
    }
}

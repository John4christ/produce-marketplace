<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    public function __construct(public string $token)
    {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $resetUrl = config('app.frontend_url') . '/reset-password?token=' . urlencode($this->token) . '&email=' . urlencode($notifiable->getEmailForPasswordReset());

        return (new MailMessage)
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->subject('Reset Your Password')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $resetUrl)
            ->line('This password reset link will expire in 60 minutes.')
            ->line('If you did not request a password reset, no further action is required.')
            ->salutation('Regards, the ' . config('app.name') . ' Team');
    }
}

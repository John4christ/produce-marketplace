<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function viewAny(User $authUser): bool
    {
        return true;
    }

    public function view(User $authUser, Payment $payment): bool
    {
        return $authUser->hasRole('admin') || $authUser->id === $payment->user_id;
    }

    public function create(User $authUser): bool
    {
        return true;
    }

    public function verify(User $authUser): bool
    {
        return true;
    }

    public function update(User $authUser, Payment $payment): bool
    {
        return $authUser->hasRole('admin');
    }

    public function delete(User $authUser, Payment $payment): bool
    {
        return $authUser->hasRole('admin');
    }
}

<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $authUser): bool
    {
        return true;
    }

    public function view(User $authUser, Order $order): bool
    {
        return $authUser->hasRole('admin') || $authUser->id === $order->user_id;
    }

    public function create(User $authUser): bool
    {
        return true;
    }

    public function update(User $authUser, Order $order): bool
    {
        return $authUser->hasRole('admin') || $authUser->id === $order->user_id;
    }

    public function updateStatus(User $authUser, Order $order): bool
    {
        if ($authUser->hasRole('admin')) {
            return true;
        }

        if ($authUser->hasRole('farmer')) {
            return $order->items()->where('farmer_id', $authUser->id)->exists();
        }

        return false;
    }

    public function delete(User $authUser, Order $order): bool
    {
        return $authUser->hasRole('admin');
    }
}

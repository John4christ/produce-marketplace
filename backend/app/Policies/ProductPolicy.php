<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function viewAny(User $authUser): bool
    {
        return true;
    }

    public function view(User $authUser, Product $product): bool
    {
        return true;
    }

    public function create(User $authUser): bool
    {
        return $authUser->hasRole('farmer') || $authUser->hasRole('admin');
    }

    public function update(User $authUser, Product $product): bool
    {
        return $authUser->hasRole('admin') || $authUser->id === $product->farmer_id;
    }

    public function delete(User $authUser, Product $product): bool
    {
        return $authUser->hasRole('admin') || $authUser->id === $product->farmer_id;
    }
}

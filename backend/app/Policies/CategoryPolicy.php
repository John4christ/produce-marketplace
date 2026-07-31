<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    public function viewAny(User $authUser): bool
    {
        return true;
    }

    public function view(User $authUser, Category $category): bool
    {
        return true;
    }

    public function create(User $authUser): bool
    {
        return $authUser->hasRole('admin') || $authUser->hasRole('farmer');
    }

    public function update(User $authUser, Category $category): bool
    {
        return $authUser->hasRole('admin') || $authUser->hasRole('farmer');
    }

    public function delete(User $authUser, Category $category): bool
    {
        return $authUser->hasRole('admin');
    }
}

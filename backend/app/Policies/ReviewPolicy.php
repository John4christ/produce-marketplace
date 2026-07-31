<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    public function viewAny(User $authUser): bool
    {
        return true;
    }

    public function view(User $authUser, Review $review): bool
    {
        return true;
    }

    public function create(User $authUser): bool
    {
        return true;
    }

    public function update(User $authUser, Review $review): bool
    {
        return $authUser->hasRole('admin') || $authUser->id === $review->user_id;
    }

    public function delete(User $authUser, Review $review): bool
    {
        return $authUser->hasRole('admin') || $authUser->id === $review->user_id;
    }
}

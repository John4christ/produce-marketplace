<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'user_id' => User::factory(),
            'title' => fake()->optional()->sentence(),
            'comment' => fake()->paragraph(),
            'rating' => fake()->numberBetween(1, 5),
        ];
    }

    public function forProduct(Product $product): self
    {
        return $this->state(fn (array $attributes) => ['product_id' => $product->id]);
    }

    public function forUser(User $user): self
    {
        return $this->state(fn (array $attributes) => ['user_id' => $user->id]);
    }

    public function highRating(): self
    {
        return $this->state(fn (array $attributes) => ['rating' => fake()->numberBetween(4, 5)]);
    }
}

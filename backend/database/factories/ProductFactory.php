<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = \App\Models\Product::class;

    public function definition(): array
    {
        $statuses = ['draft', 'published', 'archived'];
        $units = ['kg', 'bunch', 'piece', 'liter', 'pack'];

        return [
            'farmer_id' => User::factory()->withRole('farmer'),
            'category_id' => Category::factory(),
            'name' => fake()->unique()->words(3, true),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 1, 100),
            'unit' => fake()->randomElement($units),
            'quantity_available' => fake()->numberBetween(1, 500),
            'status' => fake()->randomElement($statuses),
            'tags' => fake()->randomElements(['organic', 'fresh', 'local', 'seasonal'], 2),
        ];
    }

    public function published(): self
    {
        return $this->state(fn (array $attributes) => ['status' => 'published']);
    }

    public function forFarmer(User $farmer): self
    {
        return $this->state(fn (array $attributes) => ['farmer_id' => $farmer->id]);
    }

    public function forCategory(Category $category): self
    {
        return $this->state(fn (array $attributes) => ['category_id' => $category->id]);
    }
}

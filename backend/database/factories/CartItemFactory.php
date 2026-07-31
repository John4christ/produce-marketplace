<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartItemFactory extends Factory
{
    protected $model = \App\Models\CartItem::class;

    public function definition(): array
    {
        return [
            'cart_id' => Cart::factory(),
            'product_id' => Product::factory(),
            'quantity' => fake()->numberBetween(1, 10),
            'unit_price' => fake()->randomFloat(2, 1, 50),
        ];
    }
}

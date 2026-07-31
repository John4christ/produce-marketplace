<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = \App\Models\OrderItem::class;

    public function definition(): array
    {
        $product = Product::factory()->create();
        $quantity = fake()->numberBetween(1, 5);
        $unitPrice = fake()->randomFloat(2, 1, 50);

        return [
            'order_id' => Order::factory(),
            'product_id' => $product->id,
            'farmer_id' => $product->farmer_id,
            'product_name' => $product->name,
            'product_unit' => $product->unit,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'subtotal' => $quantity * $unitPrice,
        ];
    }
}

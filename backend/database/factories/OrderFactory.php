<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        return [
            'order_number' => 'ORD-' . strtoupper(fake()->unique()->bothify('????######')),
            'user_id' => \App\Models\User::factory(),
            'status' => fake()->randomElement($statuses),
            'subtotal' => fake()->randomFloat(2, 10, 500),
            'tax' => 0,
            'shipping_cost' => 0,
            'total' => fake()->randomFloat(2, 10, 500),
            'shipping_address' => [
                'street' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'postal_code' => fake()->postcode(),
                'country' => fake()->country(),
                'phone' => fake()->phoneNumber(),
            ],
            'notes' => fake()->optional()->sentence(),
            'paid_at' => now(),
        ];
    }

    public function pending(): self
    {
        return $this->state(fn (array $attributes) => ['status' => 'pending']);
    }

    public function delivered(): self
    {
        return $this->state(fn (array $attributes) => ['status' => 'delivered']);
    }

    public function forUser($userId): self
    {
        return $this->state(fn (array $attributes) => ['user_id' => $userId]);
    }
}

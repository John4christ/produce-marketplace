<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderStatusHistoryFactory extends Factory
{
    protected $model = \App\Models\OrderStatusHistory::class;

    public function definition(): array
    {
        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        return [
            'order_id' => Order::factory(),
            'status' => fake()->randomElement($statuses),
            'notes' => fake()->sentence(),
            'created_by' => User::factory(),
        ];
    }

    public function forOrder(Order $order): self
    {
        return $this->state(fn (array $attributes) => ['order_id' => $order->id]);
    }

    public function forStatus(string $status): self
    {
        return $this->state(fn (array $attributes) => ['status' => $status]);
    }
}

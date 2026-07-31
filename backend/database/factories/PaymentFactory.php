<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = \App\Models\Payment::class;

    public function definition(): array
    {
        $statuses = ['pending', 'success', 'failed'];
        $providers = ['paystack', 'flutterwave'];
        $methods = ['card', 'bank_transfer', 'mobile_money'];

        return [
            'order_id' => Order::factory(),
            'user_id' => User::factory(),
            'provider' => fake()->randomElement($providers),
            'reference' => 'PMT-' . strtoupper(fake()->unique()->bothify('????######')),
            'amount' => fake()->randomFloat(2, 10, 500),
            'currency' => fake()->randomElement(['NGN', 'USD', 'GHS']),
            'status' => fake()->randomElement($statuses),
            'payment_method' => fake()->randomElement($methods),
            'metadata' => [
                'order_number' => fake()->unique()->bothify('ORD-######'),
                'channel' => fake()->randomElement(['card', 'bank', 'ussd']),
            ],
        ];
    }

    public function success(): self
    {
        return $this->state(fn (array $attributes) => ['status' => 'success']);
    }

    public function pending(): self
    {
        return $this->state(fn (array $attributes) => ['status' => 'pending']);
    }

    public function paystack(): self
    {
        return $this->state(fn (array $attributes) => ['provider' => 'paystack']);
    }

    public function flutterwave(): self
    {
        return $this->state(fn (array $attributes) => ['provider' => 'flutterwave']);
    }
}

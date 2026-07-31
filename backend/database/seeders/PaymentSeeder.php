<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $buyer = User::factory()->withRole('buyer')->create();

        $order = Order::factory()
            ->forUser($buyer->id)
            ->pending()
            ->create();

        Payment::factory()
            ->forOrder($order->id)
            ->forUser($buyer->id)
            ->success()
            ->paystack()
            ->create();
    }
}

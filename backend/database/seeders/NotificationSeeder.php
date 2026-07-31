<?php

namespace Database\Seeders;

use App\Notifications\BuyerOrderPlacedNotification;
use App\Notifications\FarmerNewOrderNotification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            $user->notify(new BuyerOrderPlacedNotification(\App\Models\Order::factory()->create(['user_id' => $user->id])));
            $user->notify(new FarmerNewOrderNotification(\App\Models\Order::factory()->create()));

            if ($user->hasRole('buyer')) {
                $user->notify(new \App\Notifications\BuyerOrderStatusUpdatedNotification(
                    \App\Models\Order::factory()->create(['user_id' => $user->id]),
                    'processing'
                ));
            }
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    public function run(): void
    {
        $buyer = User::factory()->withRole('buyer')->create();

        $cart = Cart::create(['user_id' => $buyer->id]);

        $products = Product::factory()->count(3)->create();

        foreach ($products as $product) {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => fake()->numberBetween(1, 3),
                'unit_price' => $product->price,
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $buyer = User::factory()->withRole('buyer')->create();
        $farmer = User::factory()->withRole('farmer')->create();
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command->warn('No categories found. Run CategorySeeder first.');
            return;
        }

        $products = Product::factory()
            ->count(5)
            ->published()
            ->forFarmer($farmer)
            ->forCategory($categories->random())
            ->create();

        $cart = Cart::create(['user_id' => $buyer->id]);

        foreach ($products->take(3) as $product) {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => fake()->numberBetween(1, 3),
                'unit_price' => $product->price,
            ]);
        }

        $order = Order::factory()
            ->forUser($buyer->id)
            ->delivered()
            ->create();

        foreach ($products->take(3) as $product) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'farmer_id' => $farmer->id,
                'product_name' => $product->name,
                'product_unit' => $product->unit,
                'quantity' => fake()->numberBetween(1, 3),
                'unit_price' => $product->price,
                'subtotal' => fake()->randomFloat(2, 5, 100),
            ]);
        }

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'pending',
            'notes' => 'Order placed successfully.',
            'created_by' => $buyer->id,
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'processing',
            'notes' => 'Order confirmed by seller.',
            'created_by' => $farmer->id,
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'shipped',
            'notes' => 'Order shipped via courier.',
            'created_by' => $farmer->id,
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'delivered',
            'notes' => 'Order delivered to customer.',
            'created_by' => $buyer->id,
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $farmer = User::factory()->withRole('farmer')->create();
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command->warn('No categories found. Run CategorySeeder first.');
            return;
        }

        $products = Product::factory()
            ->count(20)
            ->published()
            ->forFarmer($farmer)
            ->forCategory($categories->random())
            ->create();

        foreach ($products as $product) {
            ProductImage::factory()
                ->count(fake()->numberBetween(1, 5))
                ->forProduct($product)
                ->create();
        }
    }
}

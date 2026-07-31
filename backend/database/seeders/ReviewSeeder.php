<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $buyers = User::factory()->count(3)->create();
        $products = Product::factory()->count(5)->create();

        foreach ($products as $product) {
            $reviewCount = fake()->numberBetween(2, 6);

            Review::factory()
                ->count($reviewCount)
                ->forProduct($product)
                ->forUser(fake()->randomElement($buyers))
                ->highRating()
                ->create();

            if (fake()->boolean(30)) {
                Review::factory()
                    ->forProduct($product)
                    ->forUser(fake()->randomElement($buyers))
                    ->state(['rating' => fake()->numberBetween(1, 2)])
                    ->create();
            }
        }
    }
}

<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductImageFactory extends Factory
{
    protected $model = \App\Models\ProductImage::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'image_path' => 'products/' . fake()->uuid() . '.jpg',
            'alt_text' => fake()->sentence(),
            'sort_order' => 0,
        ];
    }
}

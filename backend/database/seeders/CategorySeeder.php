<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Fruits', 'slug' => 'fruits', 'description' => 'Fresh fruits'],
            ['name' => 'Vegetables', 'slug' => 'vegetables', 'description' => 'Fresh vegetables'],
            ['name' => 'Dairy', 'slug' => 'dairy', 'description' => 'Dairy products'],
            ['name' => 'Grains', 'slug' => 'grains', 'description' => 'Grains and cereals'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}

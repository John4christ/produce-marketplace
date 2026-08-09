<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Fruits', 'slug' => 'fruits'],
            ['name' => 'Vegetables', 'slug' => 'vegetables'],
            ['name' => 'Grains', 'slug' => 'grains'],
            ['name' => 'Tubers', 'slug' => 'tubers'],
            ['name' => 'Livestock', 'slug' => 'livestock'],
            ['name' => 'Dairy', 'slug' => 'dairy'],
            ['name' => 'Herbs', 'slug' => 'herbs'],
            ['name' => 'Spices', 'slug' => 'spices'],
        ];

       foreach ($categories as $category) {
    Category::firstOrCreate(
        ['slug' => $category['slug']],
        ['name' => $category['name']]
    );
}
    
    }
}   
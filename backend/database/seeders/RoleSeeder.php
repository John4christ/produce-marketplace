<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Platform administrator with full access',
            ],
            [
                'name' => 'Farmer',
                'slug' => 'farmer',
                'description' => 'Produces and manages products',
            ],
            [
                'name' => 'Buyer',
                'slug' => 'buyer',
                'description' => 'Purchases products from the marketplace',
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
}
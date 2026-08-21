<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminCommand extends Command
{
    protected $signature = 'admin:create
        {--name= : Full name of the new administrator}
        {--email= : Email address of the new administrator}
        {--password= : Password for the new administrator}';

    protected $description = 'Create a new administrator account in the existing users table';

    public function handle(): int
    {
        $name = $this->option('name') ?: $this->ask('Name of the new administrator');
        $email = $this->option('email') ?: $this->ask('Email address of the new administrator');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('The email address is not valid.');
            return self::FAILURE;
        }

        if (User::where('email', $email)->exists()) {
            $this->error("A user with the email [{$email}] already exists.");
            return self::FAILURE;
        }

        $password = $this->option('password') ?: $this->secret('Password for the new administrator (input hidden)');

        if (strlen((string) $password) < 8) {
            $this->error('The password must be at least 8 characters.');
            return self::FAILURE;
        }

        $role = Role::where('slug', 'admin')->first();

        if (!$role) {
            $this->error('The [admin] role does not exist. Run: php artisan db:seed --class=RoleSeeder');
            return self::FAILURE;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'status' => User::STATUS_ACTIVE,
        ]);

        $user->forceFill(['email_verified_at' => now()])->save();

        $user->roles()->attach($role->id);

        $this->info("Administrator [{$user->name}] created successfully.");
        $this->table(
            ['ID', 'Name', 'Email', 'Roles'],
            [[$user->id, $user->name, $user->email, 'admin']]
        );

        return self::SUCCESS;
    }
}

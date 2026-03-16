<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@pic.tj'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('Momajon10'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('super_admin');
    }
}

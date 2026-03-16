<?php

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('regular verified users can not access the admin dashboard', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('content managers can access news administration', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('content_manager');

    $this->actingAs($user)
        ->get(route('admin.news.index'))
        ->assertOk();
});

test('content managers can not access user administration', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('content_manager');

    $this->actingAs($user)
        ->get(route('admin.users.index'))
        ->assertForbidden();
});

test('super admins can access user administration', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('super_admin');

    $this->actingAs($user)
        ->get(route('admin.users.index'))
        ->assertOk();
});

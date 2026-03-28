<?php

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Pest\Browser\Playwright\Playwright;

beforeEach(function () {
    Playwright::setTimeout(12_000);
});

function dropdownAdminUser(): User
{
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $user->assignRole('super_admin');

    return $user;
}

test('public projects dropdown opens from the header trigger', function () {
    visit('/')
        ->on()->desktop()
        ->click('[data-test="public-projects-menu-trigger"]')
        ->assertVisible('[data-test="public-projects-menu-content"]')
        ->assertVisible(
            '[data-test="public-projects-menu-content"] [role="menuitem"][href="/activities"]'
        )
        ->assertVisible(
            '[data-test="public-projects-menu-content"] [role="menuitem"][href="/documents"]'
        );
});

test('admin user dropdown opens from the sidebar trigger', function () {
    $this->seed(RolesAndPermissionsSeeder::class);
    $this->actingAs(dropdownAdminUser());

    visit('/admin')
        ->on()->desktop()
        ->click('[data-test="sidebar-menu-button"]')
        ->assertVisible('[data-test="sidebar-user-menu-content"]')
        ->assertVisible(
            '[data-test="sidebar-user-menu-content"] a[href="/settings/profile"]'
        )
        ->assertVisible('[data-test="logout-button"]');
});

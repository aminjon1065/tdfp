<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('appearance settings page is displayed', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('appearance.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/appearance')
        );
});

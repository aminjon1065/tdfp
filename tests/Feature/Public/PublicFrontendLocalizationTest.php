<?php

use Inertia\Testing\AssertableInertia as Assert;

test('localized public frontend routes share russian locale on updated surfaces', function () {
    $this->get('/?lang=ru')
        ->assertOk()
        ->assertSessionHas('locale', 'ru')
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
            ->where('locale', 'ru')
        );

    $this->get('/grm?lang=ru')
        ->assertOk()
        ->assertSessionHas('locale', 'ru')
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/grm/index')
            ->where('locale', 'ru')
        );

    $this->get('/grm/submit?lang=ru')
        ->assertOk()
        ->assertSessionHas('locale', 'ru')
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/grm/submit')
            ->where('locale', 'ru')
        );

    $this->get('/grm/track?lang=ru')
        ->assertOk()
        ->assertSessionHas('locale', 'ru')
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/grm/track')
            ->where('locale', 'ru')
        );

    $this->get('/subscribe?lang=ru')
        ->assertOk()
        ->assertSessionHas('locale', 'ru')
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/subscriptions/show')
            ->where('locale', 'ru')
        );
});

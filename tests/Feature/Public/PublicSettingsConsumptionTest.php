<?php

use App\Models\Setting;
use Inertia\Testing\AssertableInertia as Assert;

test('home does not expose redundant settings payload and contact uses cached setting values', function () {
    Setting::set('contact_email', 'contact@pic.tj');
    Setting::set('contact_phone', '+992 900 000 000');
    Setting::set('contact_address', 'Dushanbe, Tajikistan');

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
            ->missing('settings')
            ->where('siteSettings.contact_email', 'contact@pic.tj')
        );

    $this->get(route('contact'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/contact')
            ->where('settings.contact_email', 'contact@pic.tj')
            ->where('settings.contact_phone', '+992 900 000 000')
            ->where('settings.contact_address', 'Dushanbe, Tajikistan')
        );
});

<?php

use App\Mail\SubscriptionConfirmationMail;
use App\Models\EmailSubscriber;
use App\Models\User;
use App\Modules\Subscriptions\Services\SubscriptionService;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('public subscription requests create pending subscribers and queue confirmation mail', function () {
    Mail::fake();

    $response = $this->post(route('subscriptions.store'), [
        'email' => 'subscriber@example.com',
        'locale' => 'ru',
    ]);

    $response->assertRedirect(route('subscriptions.show', ['status' => 'confirmation-sent']));

    $subscriber = EmailSubscriber::query()->where('email', 'subscriber@example.com')->first();

    expect($subscriber)->not->toBeNull()
        ->and($subscriber?->status)->toBe('pending')
        ->and($subscriber?->locale)->toBe('ru')
        ->and($subscriber?->confirmation_token)->not->toBeNull();

    Mail::assertQueued(SubscriptionConfirmationMail::class, function (SubscriptionConfirmationMail $mail) use ($subscriber) {
        return $mail->email === $subscriber->email
            && str_contains($mail->confirmationUrl, (string) $subscriber->confirmation_token);
    });
});

test('subscription confirmation activates pending subscribers', function () {
    $subscriber = EmailSubscriber::factory()->create([
        'email' => 'confirm@example.com',
    ]);

    $url = app(SubscriptionService::class)->confirmationUrl($subscriber);

    $this->get($url)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/subscriptions/show')
            ->where('subscriptionAction.intent', 'confirm')
            ->where('subscriptionAction.email', 'confirm@example.com')
        );

    $response = $this->post($url);

    $response->assertRedirect(route('subscriptions.show', ['status' => 'confirmed']));

    $subscriber->refresh();

    expect($subscriber->status)->toBe('active')
        ->and($subscriber->confirmation_token)->toBeNull()
        ->and($subscriber->unsubscribe_token)->not->toBeNull()
        ->and($subscriber->confirmed_at)->not->toBeNull();
});

test('subscription unsubscribe requires explicit post after signed review page', function () {
    $subscriber = EmailSubscriber::factory()->active()->create([
        'email' => 'unsubscribe@example.com',
    ]);

    $url = app(SubscriptionService::class)->unsubscribeUrl($subscriber);

    expect($url)->not->toBeNull();

    $this->get($url)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/subscriptions/show')
            ->where('subscriptionAction.intent', 'unsubscribe')
            ->where('subscriptionAction.email', 'unsubscribe@example.com')
        );

    $this->post($url)
        ->assertRedirect(route('subscriptions.show', ['status' => 'unsubscribed']));

    $subscriber->refresh();

    expect($subscriber->status)->toBe('unsubscribed')
        ->and($subscriber->unsubscribed_at)->not->toBeNull();
});

test('already active subscribers are not duplicated or re-queued', function () {
    Mail::fake();

    EmailSubscriber::factory()->active()->create([
        'email' => 'active@example.com',
    ]);

    $response = $this->post(route('subscriptions.store'), [
        'email' => 'active@example.com',
        'locale' => 'en',
    ]);

    $response->assertRedirect(route('subscriptions.show', ['status' => 'already-active']));

    expect(EmailSubscriber::query()->where('email', 'active@example.com')->count())->toBe(1);

    Mail::assertNothingQueued();
});

test('subscription page renders current status state', function () {
    $this->get(route('subscriptions.show', ['status' => 'confirmation-sent']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/subscriptions/show')
            ->where('subscriptionStatus', 'confirmation-sent')
            ->where('subscriptionAction', null)
        );
});

test('admin users with permission can review and export subscribers', function () {
    $admin = User::factory()->create();
    $admin->assignRole('content_manager');

    EmailSubscriber::factory()->active()->create([
        'email' => 'first@example.com',
    ]);
    EmailSubscriber::factory()->create([
        'email' => 'second@example.com',
        'status' => 'pending',
    ]);

    $this->actingAs($admin);

    $this->get('/admin/subscriptions?status=active')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/subscriptions/index')
            ->where('filters.status', 'active')
            ->where('subscribers.data', fn (Collection $items) => $items->count() === 1 && $items->first()['email'] === 'first@example.com')
        );

    $this->get('/admin/subscriptions/export?status=active')
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');
});

test('subscriber export streams all matching rows without truncating after the first thousand', function () {
    $admin = User::factory()->create();
    $admin->assignRole('content_manager');

    EmailSubscriber::factory()->count(1001)->active()->create();

    $this->actingAs($admin);

    $response = $this->get('/admin/subscriptions/export?status=active');

    $response->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');

    $content = $response->streamedContent();

    expect(substr_count($content, PHP_EOL))->toBe(1002)
        ->and($content)->toContain('email,status,locale,confirmed_at,unsubscribed_at');
});

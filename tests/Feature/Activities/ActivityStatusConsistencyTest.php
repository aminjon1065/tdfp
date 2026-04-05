<?php

use App\ActivityStatus;
use App\Models\Activity;
use App\Models\SearchIndex;
use App\Models\User;
use Database\Seeders\ActivitySeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    Config::set('queue.default', 'sync');
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('activity admin flow accepts only declared enum statuses', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('content_manager');

    $this->actingAs($user)
        ->post(route('admin.activities.store'), [
            'status' => ActivityStatus::InProgress->value,
            'domain_slug' => 'digital-skills',
            'activity_number' => 44,
            'translations' => [
                'en' => [
                    'title' => 'Digital Skills Delivery',
                ],
            ],
        ])
        ->assertRedirect(route('admin.activities.index'));

    $activity = Activity::query()->firstOrFail();

    expect($activity->status)->toBe(ActivityStatus::InProgress)
        ->and($activity->domain_slug)->toBe('digital-skills')
        ->and($activity->activity_number)->toBe(44)
        ->and(SearchIndex::query()
            ->where('entity_type', Activity::class)
            ->where('entity_id', $activity->id)
            ->where('language', 'en')
            ->value('title'))->toBe('Digital Skills Delivery');

    $this->actingAs($user)
        ->from(route('admin.activities.create'))
        ->post(route('admin.activities.store'), [
            'status' => 'published',
            'translations' => [
                'en' => [
                    'title' => 'Invalid Activity Status',
                ],
            ],
        ])
        ->assertRedirect(route('admin.activities.create'))
        ->assertSessionHasErrors('status');
});

test('activity seeder uses only declared activity statuses', function () {
    $this->seed(ActivitySeeder::class);

    expect(Activity::query()->count())->toBeGreaterThan(0);

    Activity::query()->each(function (Activity $activity) {
        expect($activity->status)->toBe(ActivityStatus::InProgress);
    });
});

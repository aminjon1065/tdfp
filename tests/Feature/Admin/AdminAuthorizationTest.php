<?php

use App\Models\AuditLog;
use App\Models\Setting;
use App\Models\User;
use Database\Seeders\CmsPageSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Inertia\Testing\AssertableInertia as Assert;

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

test('content managers can access cms editor screens for pages and news', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('content_manager');

    $this->actingAs($user)
        ->get(route('admin.pages.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('admin/pages/create'));

    $this->actingAs($user)
        ->get(route('admin.news.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('admin/news/create'));
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

test('super admins can update analytics settings through the nested settings payload', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('super_admin');

    $this->actingAs($user)
        ->post(route('admin.settings.update'), [
            'settings' => [
                'analytics_enabled' => '1',
                'analytics_provider' => 'ga4',
                'google_analytics_id' => 'G-TEST1234',
                'analytics_owner_name' => 'Digital Team',
                'analytics_owner_email' => 'analytics@example.com',
            ],
        ])
        ->assertRedirect();

    expect(Setting::get('analytics_enabled'))->toBe('1')
        ->and(Setting::get('analytics_provider'))->toBe('ga4')
        ->and(Setting::get('google_analytics_id'))->toBe('G-TEST1234')
        ->and(Setting::get('analytics_owner_name'))->toBe('Digital Team')
        ->and(Setting::get('analytics_owner_email'))->toBe('analytics@example.com');
});

test('analytics settings reject invalid ga4 measurement ids', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('super_admin');

    $this->actingAs($user)
        ->post(route('admin.settings.update'), [
            'settings' => [
                'analytics_enabled' => '1',
                'analytics_provider' => 'ga4',
                'google_analytics_id' => 'UA-12345-1',
            ],
        ])
        ->assertSessionHasErrors('settings.google_analytics_id');
});

test('super admins can update operational readiness settings through admin settings', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('super_admin');

    $this->actingAs($user)
        ->post(route('admin.settings.update'), [
            'settings' => [
                'support_contact_name' => 'Operations Desk',
                'support_contact_email' => 'support@example.com',
                'support_contact_phone' => '+992 123 456 789',
                'support_hours' => 'Mon-Fri 09:00-18:00',
                'incident_contact_email' => 'incident@example.com',
                'maintenance_report_email' => 'reports@example.com',
                'backup_frequency' => 'daily',
                'backup_retention_days' => '30',
            ],
        ])
        ->assertRedirect();

    expect(Setting::get('support_contact_name'))->toBe('Operations Desk')
        ->and(Setting::get('support_contact_email'))->toBe('support@example.com')
        ->and(Setting::get('support_contact_phone'))->toBe('+992 123 456 789')
        ->and(Setting::get('support_hours'))->toBe('Mon-Fri 09:00-18:00')
        ->and(Setting::get('incident_contact_email'))->toBe('incident@example.com')
        ->and(Setting::get('maintenance_report_email'))->toBe('reports@example.com')
        ->and(Setting::get('backup_frequency'))->toBe('daily')
        ->and(Setting::get('backup_retention_days'))->toBe('30');
});

test('admin dashboard exposes operational readiness summary', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('super_admin');

    $this->seed(CmsPageSeeder::class);

    Setting::set('analytics_owner_name', 'Digital Team');
    Setting::set('analytics_owner_email', 'analytics@example.com');
    Setting::set('google_analytics_id', 'G-TEST1234');
    Setting::set('support_contact_name', 'Operations Desk');
    Setting::set('support_contact_email', 'support@example.com');
    Setting::set('support_contact_phone', '+992 123 456 789');
    Setting::set('support_hours', 'Mon-Fri 09:00-18:00');
    Setting::set('incident_contact_email', 'incident@example.com');
    Setting::set('maintenance_report_email', 'reports@example.com');
    Setting::set('backup_frequency', 'daily');
    Setting::set('backup_retention_days', '30');

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('operational_readiness.completion_percentage', 100)
            ->where('operational_readiness.is_ready', true)
            ->where('operational_readiness.missing_count', 0)
            ->where('operational_readiness.items', fn ($items) => count($items) === 11)
            ->where('automated_checks.failing_count', 0)
            ->where('automated_checks.passing_count', 3)
            ->where('operational_audit.is_ready', true)
        );
});

test('admin dashboard shares russian locale for translated admin ui', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('super_admin');

    $this->withSession(['locale' => 'ru']);

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('locale', 'ru')
        );
});

test('super admins can filter audit logs by user action entity type and date', function () {
    $admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $admin->assignRole('super_admin');

    $targetUser = User::factory()->create([
        'email_verified_at' => now(),
        'name' => 'Target User',
    ]);

    $otherUser = User::factory()->create([
        'email_verified_at' => now(),
        'name' => 'Other User',
    ]);

    AuditLog::create([
        'user_id' => $targetUser->id,
        'action' => 'updated',
        'entity_type' => \App\Models\News::class,
        'entity_id' => 501,
        'ip_address' => '127.0.0.1',
        'created_at' => now()->subDay(),
    ]);

    AuditLog::create([
        'user_id' => $otherUser->id,
        'action' => 'created',
        'entity_type' => \App\Models\Document::class,
        'entity_id' => 777,
        'ip_address' => '127.0.0.2',
        'created_at' => now()->subDays(10),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.audit-logs.index', [
            'search' => 'Target',
            'action' => 'updated',
            'entity_type' => \App\Models\News::class,
            'user_id' => $targetUser->id,
            'date_from' => now()->subDays(2)->toDateString(),
            'date_to' => now()->toDateString(),
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/audit-logs/index')
            ->where('filters.search', 'Target')
            ->where('filters.action', 'updated')
            ->where('filters.entity_type', \App\Models\News::class)
            ->where('filters.user_id', $targetUser->id)
            ->where('logs.data', fn ($items) => count($items) === 1
                && $items[0]['action'] === 'updated'
                && $items[0]['user']['name'] === 'Target User'
                && $items[0]['entity_type'] === \App\Models\News::class)
        );
});

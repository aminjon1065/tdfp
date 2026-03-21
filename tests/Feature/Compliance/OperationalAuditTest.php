<?php

use App\Core\Services\OperationalAuditService;
use App\Models\Setting;
use Database\Seeders\CmsPageSeeder;

test('operational audit aggregates governance readiness and automated checks', function () {
    $this->seed(CmsPageSeeder::class);

    Setting::set('analytics_owner_name', 'Digital Team');
    Setting::set('analytics_owner_email', 'analytics@example.com');
    Setting::set('google_analytics_id', 'G-TEST1234');
    Setting::set('analytics_enabled', '1');
    Setting::set('support_contact_name', 'Operations Desk');
    Setting::set('support_contact_email', 'support@example.com');
    Setting::set('support_contact_phone', '+992 123 456 789');
    Setting::set('support_hours', 'Mon-Fri 09:00-18:00');
    Setting::set('incident_contact_email', 'incident@example.com');
    Setting::set('maintenance_report_email', 'reports@example.com');
    Setting::set('backup_frequency', 'daily');
    Setting::set('backup_retention_days', '30');

    $audit = app(OperationalAuditService::class)->audit();

    expect($audit['governance']['is_ready'])->toBeTrue()
        ->and($audit['governance']['items'])->toHaveCount(11)
        ->and($audit['automated_checks']['failing_count'])->toBe(0)
        ->and($audit['automated_checks']['passing_count'])->toBe(3)
        ->and($audit['overall']['is_ready'])->toBeTrue();

    $this->artisan('operations:audit')
        ->assertSuccessful();
});

test('operational audit stays not ready when governance values are missing', function () {
    $audit = app(OperationalAuditService::class)->audit();

    expect($audit['governance']['is_ready'])->toBeFalse()
        ->and($audit['governance']['missing_count'])->toBeGreaterThan(0)
        ->and($audit['overall']['is_ready'])->toBeFalse();
});

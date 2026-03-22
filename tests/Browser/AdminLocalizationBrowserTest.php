<?php

use App\Models\Setting;
use App\Models\User;
use Database\Seeders\CmsPageSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Pest\Browser\Playwright\Playwright;

beforeEach(function () {
    Playwright::setTimeout(12_000);

    $this->seed(RolesAndPermissionsSeeder::class);
});

function adminUser(): User
{
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $user->assignRole('super_admin');

    return $user;
}

test('admin dashboard renders russian navigation and headings after locale switch', function () {
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

    $this->actingAs(adminUser());

    visit('/language/ru')->assertNoSmoke();

    visit('/admin')
        ->assertNoSmoke()
        ->assertSee('Админка PIC')
        ->assertSee('Навигация')
        ->assertSee('Панель')
        ->assertSee('Операционный аудит');
});

test('admin create forms render russian labels and actions after locale switch', function () {
    $this->actingAs(adminUser());

    visit('/language/ru')->assertNoSmoke();

    visit('/admin/pages/create')
        ->assertNoSmoke()
        ->assertSee('Страницы')
        ->assertSee('Статус')
        ->assertSee('Переводы')
        ->assertSee('Заголовок')
        ->assertSee('Открыть превью')
        ->assertSee('Отмена');
});

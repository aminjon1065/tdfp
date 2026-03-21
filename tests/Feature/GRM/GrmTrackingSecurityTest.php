<?php

use App\Models\GrmCase;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('public tracking requires both ticket number and tracking token', function () {
    $case = GrmCase::create([
        'ticket_number' => 'GRM-2026-00001',
        'tracking_token' => 'ABCDEF1234567890ABCDEF1234567890',
        'complainant_name' => 'Citizen User',
        'email' => 'citizen@example.com',
        'category' => 'other',
        'description' => 'Sensitive grievance details that should not be public.',
        'status' => 'under_review',
    ]);

    $case->statusHistory()->create([
        'status' => 'under_review',
        'notes' => 'Internal notes should stay private.',
    ]);

    $this->post(route('grm.track.search'), [
        'ticket_number' => 'GRM-2026-00001',
    ])->assertSessionHasErrors('tracking_token');

    $this->post(route('grm.track.search'), [
        'ticket_number' => 'GRM-2026-00001',
        'tracking_token' => '00000000000000000000000000000000',
    ])->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/grm/track')
            ->where('notFound', true)
            ->where('case', null)
        );

    $this->post(route('grm.track.search'), [
        'ticket_number' => 'GRM-2026-00001',
        'tracking_token' => 'ABCDEF1234567890ABCDEF1234567890',
    ])->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/grm/track')
            ->where('case.ticket_number', 'GRM-2026-00001')
            ->where('case.status', 'under_review')
            ->missing('case.category')
            ->missing('case.statusHistory.0.notes')
        );
});

test('grm submission rejects unsafe attachment types', function () {
    $response = $this->post(route('grm.store'), [
        'complainant_name' => 'Unsafe Upload',
        'email' => 'unsafe@example.com',
        'category' => 'other',
        'description' => 'This is a valid grievance description long enough for validation.',
        'attachments' => [
            UploadedFile::fake()->create('malware.exe', 120, 'application/octet-stream'),
        ],
    ]);

    $response->assertSessionHasErrors('attachments.0');
});

test('grm status assignment rejects non officer assignees', function () {
    $officer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $officer->assignRole('grm_officer');

    $nonOfficer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $nonOfficer->assignRole('content_manager');

    $case = GrmCase::create([
        'ticket_number' => 'GRM-2026-00002',
        'tracking_token' => '1234567890ABCDEF1234567890ABCDEF',
        'complainant_name' => 'Citizen User',
        'email' => 'citizen2@example.com',
        'category' => 'other',
        'description' => 'Another grievance description.',
        'status' => 'submitted',
    ]);

    $this->actingAs($officer)
        ->patch(route('admin.grm.update-status', $case), [
            'status' => 'under_review',
            'officer_id' => $nonOfficer->id,
        ])
        ->assertStatus(422);
});

test('public tracking expires for closed complaints after the retention window', function () {
    config(['grm.public_tracking_retention_days' => 30]);

    $case = GrmCase::create([
        'ticket_number' => 'GRM-2026-00003',
        'tracking_token' => 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        'complainant_name' => 'Expired Citizen',
        'email' => 'expired@example.com',
        'category' => 'other',
        'description' => 'Closed grievance retained for a limited public tracking period.',
        'status' => 'closed',
        'closed_at' => now()->subDays(40),
        'public_tracking_expires_at' => now()->subDays(10),
    ]);

    $case->statusHistory()->create([
        'status' => 'closed',
        'notes' => 'Case closed.',
    ]);

    $this->post(route('grm.track.search'), [
        'ticket_number' => 'GRM-2026-00003',
        'tracking_token' => 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
    ])->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/grm/track')
            ->where('trackingExpired', true)
            ->where('case', null)
            ->where('notFound', false)
        );
});

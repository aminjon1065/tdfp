<?php

use App\Mail\GrmSubmittedMail;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\GrmCase;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\Procurement;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('content managers can create news entries', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('content_manager');

    $category = NewsCategory::create([
        'name' => 'Updates',
        'slug' => 'updates',
    ]);

    $this->actingAs($user)
        ->post(route('admin.news.store'), [
            'category_id' => $category->id,
            'status' => 'published',
            'is_featured' => true,
            'translations' => [
                'en' => [
                    'title' => 'Platform launch',
                    'summary' => 'Launch summary',
                    'content' => 'Launch content',
                ],
            ],
        ])
        ->assertRedirect(route('admin.news.index'));

    $news = News::query()->firstOrFail();

    expect($news->status)->toBe('published')
        ->and($news->translations()->where('language', 'en')->first()?->title)->toBe('Platform launch');
});

test('content managers can upload documents', function () {
    Storage::fake('public');

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('content_manager');

    $category = DocumentCategory::create([
        'name' => 'Policies',
        'slug' => 'policies',
    ]);

    $this->actingAs($user)
        ->post(route('admin.documents.store'), [
            'category_id' => $category->id,
            'file' => UploadedFile::fake()->create('policy.pdf', 128, 'application/pdf'),
            'translations' => [
                'en' => [
                    'title' => 'Policy Document',
                    'description' => 'Document description',
                ],
            ],
        ])
        ->assertRedirect(route('admin.documents.index'));

    $document = Document::query()->firstOrFail();

    Storage::disk('public')->assertExists($document->file_path);
    expect($document->translations()->where('language', 'en')->first()?->title)->toBe('Policy Document');
});

test('procurement officers can create procurements linked to documents', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('procurement_officer');

    $document = Document::create([
        'file_path' => 'documents/specs.pdf',
        'file_type' => 'pdf',
        'published_at' => now(),
    ]);

    $this->actingAs($user)
        ->post(route('admin.procurement.store'), [
            'reference_number' => 'RFQ-100',
            'status' => 'open',
            'publication_date' => now()->toDateString(),
            'deadline' => now()->addWeek()->toDateString(),
            'document_ids' => [$document->id],
            'translations' => [
                'en' => [
                    'title' => 'Procurement Notice',
                    'description' => 'Procurement description',
                ],
            ],
        ])
        ->assertRedirect(route('admin.procurement.index'));

    $procurement = Procurement::query()->firstOrFail();

    expect($procurement->reference_number)->toBe('RFQ-100')
        ->and($procurement->documents()->pluck('documents.id')->all())->toBe([$document->id]);
});

test('grm submissions are persisted and confirmation emails are queued', function () {
    Mail::fake();
    Storage::fake('public');

    $this->post(route('grm.store'), [
        'complainant_name' => 'Amina User',
        'email' => 'amina@example.com',
        'phone' => '+992900000000',
        'category' => 'procurement',
        'description' => 'This is a detailed grievance description with enough characters.',
        'attachments' => [
            UploadedFile::fake()->create('evidence.pdf', 64, 'application/pdf'),
        ],
    ])->assertRedirect();

    $case = GrmCase::query()->firstOrFail();

    expect($case->status)->toBe('submitted')
        ->and($case->attachments()->count())->toBe(1)
        ->and($case->statusHistory()->count())->toBe(1);

    Mail::assertQueued(GrmSubmittedMail::class, function (GrmSubmittedMail $mail) use ($case) {
        return $mail->case->is($case);
    });
});

test('grm officers can update case statuses and add messages', function () {
    $officer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $officer->assignRole('grm_officer');

    $case = GrmCase::create([
        'ticket_number' => 'GRM-2026-00001',
        'complainant_name' => 'Citizen User',
        'email' => 'citizen@example.com',
        'category' => 'other',
        'description' => 'Original grievance text',
        'status' => 'submitted',
    ]);

    $this->actingAs($officer)
        ->patch(route('admin.grm.update-status', $case), [
            'status' => 'under_review',
            'notes' => 'Assigned for review',
        ])
        ->assertRedirect();

    $this->actingAs($officer)
        ->post(route('admin.grm.add-message', $case), [
            'message' => 'We are reviewing your request.',
        ])
        ->assertRedirect();

    expect($case->fresh()->status)->toBe('under_review')
        ->and($case->messages()->count())->toBe(1)
        ->and($case->statusHistory()->latest('id')->first()?->status)->toBe('under_review');
});

<?php

use App\Mail\GrmSubmittedMail;
use App\Models\AuditLog;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\GrmCase;
use App\Models\MediaItem;
use App\Models\MediaItemTranslation;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\Page;
use App\Models\Procurement;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

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

test('cms page and news content are sanitized before persistence', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('content_manager');

    $this->actingAs($user)
        ->post(route('admin.pages.store'), [
            'status' => 'published',
            'translations' => [
                'en' => [
                    'title' => 'Sanitized Page',
                    'content' => '<p>Safe</p><script>alert(1)</script><a href="javascript:alert(1)" onclick="evil()">Link</a><strong onclick="evil()">Bold</strong>',
                    'meta_title' => 'Meta',
                    'meta_description' => 'Description',
                ],
            ],
        ])
        ->assertRedirect(route('admin.pages.index'));

    $page = Page::query()->firstOrFail();
    $pageContent = $page->translations()->where('language', 'en')->firstOrFail()->content;

    expect($pageContent)
        ->toContain('<p>Safe</p>')
        ->toContain('<a>Link</a>')
        ->toContain('<strong>Bold</strong>')
        ->not->toContain('<script')
        ->not->toContain('javascript:')
        ->not->toContain('onclick=');

    $category = NewsCategory::create([
        'name' => 'Updates',
        'slug' => 'updates-sanitized',
    ]);

    $this->actingAs($user)
        ->post(route('admin.news.store'), [
            'category_id' => $category->id,
            'status' => 'published',
            'translations' => [
                'en' => [
                    'title' => 'Sanitized News',
                    'summary' => 'Summary',
                    'content' => '<p>News</p><iframe src="https://example.com"></iframe><img src="/storage/news/test.jpg" onerror="evil()" alt="image" />',
                ],
            ],
        ])
        ->assertRedirect(route('admin.news.index'));

    $news = News::query()->latest('id')->firstOrFail();
    $newsContent = $news->translations()->where('language', 'en')->firstOrFail()->content;

    expect($newsContent)
        ->toContain('<p>News</p>')
        ->toContain('<img src="/storage/news/test.jpg" alt="image">')
        ->not->toContain('<iframe')
        ->not->toContain('onerror=');
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

test('content managers can upload editor images through the media endpoint', function () {
    Storage::fake('public');

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('content_manager');

    $response = $this->actingAs($user)
        ->post(route('admin.media.editor-image'), [
            'image' => UploadedFile::fake()->image('editor-photo.png', 1200, 800),
            'alt' => 'Inline editorial image',
        ], [
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ]);

    $response
        ->assertOk()
        ->assertJsonStructure([
            'id',
            'url',
            'alt',
        ]);

    $payload = $response->json();

    expect($payload['alt'])->toBe('Inline editorial image')
        ->and($payload['url'])->toContain('/storage/media/editor-images/');

    $media = \App\Models\MediaItem::query()->findOrFail($payload['id']);

    Storage::disk('public')->assertExists($media->file_path);
    expect($media->type)->toBe('image')
        ->and($media->is_public)->toBeFalse();
});

test('content managers can create embedded public video media without uploading a file', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('content_manager');

    $this->actingAs($user)
        ->post(route('admin.media.store'), [
            'type' => 'video',
            'embed_url' => 'https://www.youtube.com/embed/example-video',
            'translations' => [
                'en' => [
                    'title' => 'Public briefing video',
                    'description' => 'Embedded project briefing',
                ],
            ],
        ])
        ->assertRedirect(route('admin.media.index'));

    $media = MediaItem::query()
        ->where('embed_url', 'https://www.youtube.com/embed/example-video')
        ->firstOrFail();

    expect($media->type)->toBe('video')
        ->and($media->file_path)->toBeNull()
        ->and($media->is_public)->toBeTrue();
});

test('image media validation fails gracefully when no file is uploaded', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('content_manager');

    $this->actingAs($user)
        ->from(route('admin.media.create'))
        ->post(route('admin.media.store'), [
            'type' => 'image',
            'translations' => [
                'en' => [
                    'title' => 'Missing file image',
                    'description' => 'Should fail validation',
                ],
            ],
        ])
        ->assertRedirect(route('admin.media.create'))
        ->assertSessionHasErrors('file');
});

test('public media gallery excludes non public editor assets', function () {
    $publicMedia = MediaItem::create([
        'type' => 'image',
        'is_public' => true,
        'file_path' => 'media/images/public-image.jpg',
    ]);

    MediaItemTranslation::create([
        'media_item_id' => $publicMedia->id,
        'language' => 'en',
        'title' => 'Public image',
    ]);

    $editorAsset = MediaItem::create([
        'type' => 'image',
        'is_public' => false,
        'file_path' => 'media/editor-images/internal-inline-image.jpg',
    ]);

    MediaItemTranslation::create([
        'media_item_id' => $editorAsset->id,
        'language' => 'en',
        'title' => 'Internal inline image',
    ]);

    $this->get(route('media.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/media/index')
            ->where('items.data', fn ($items) => count($items) === 1
                && $items[0]['id'] === $publicMedia->id
                && $items[0]['file_path'] === 'media/images/public-image.jpg')
        );
});

test('content managers can generate owner scoped editorial previews for pages and news', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $user->assignRole('content_manager');

    $otherUser = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $otherUser->assignRole('content_manager');

    $category = NewsCategory::create([
        'name' => 'Editorial',
        'slug' => 'editorial',
    ]);

    $pagePreviewResponse = $this->actingAs($user)
        ->post(route('admin.editorial-preview.pages.store'), [
            'status' => 'draft',
            'translations' => [
                'en' => [
                    'title' => 'Preview Page Title',
                    'content' => '<p>Preview page body.</p>',
                    'meta_title' => 'Preview Page Meta',
                    'meta_description' => 'Preview page description.',
                ],
            ],
        ], [
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ]);

    $pagePreviewResponse
        ->assertOk()
        ->assertJsonStructure(['preview_url']);

    $pagePreviewUrl = $pagePreviewResponse->json('preview_url');

    $this->actingAs($user)
        ->get($pagePreviewUrl)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/page')
            ->where('page.translations.0.title', 'Preview Page Title')
            ->where('previewMeta.label', 'Editorial preview')
        );

    $this->actingAs($otherUser)
        ->get($pagePreviewUrl)
        ->assertNotFound();

    $newsPreviewResponse = $this->actingAs($user)
        ->post(route('admin.editorial-preview.news.store'), [
            'category_id' => $category->id,
            'status' => 'draft',
            'is_featured' => true,
            'featured_image_url' => 'https://example.com/preview-news.jpg',
            'translations' => [
                'en' => [
                    'title' => 'Preview News Title',
                    'summary' => 'Preview news summary.',
                    'content' => '<p>Preview news body.</p>',
                ],
            ],
        ], [
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ]);

    $newsPreviewResponse
        ->assertOk()
        ->assertJsonStructure(['preview_url']);

    $newsPreviewUrl = $newsPreviewResponse->json('preview_url');

    $this->actingAs($user)
        ->get($newsPreviewUrl)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/news/show')
            ->where('news.translations.0.title', 'Preview News Title')
            ->where('news.featured_image_url', 'https://example.com/preview-news.jpg')
            ->where('previewMeta.label', 'Editorial preview')
        );

    $this->actingAs($otherUser)
        ->get($newsPreviewUrl)
        ->assertNotFound();
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
    Storage::fake('local');

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
        ->and($case->tracking_token)->not->toBeNull()
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

test('grm attachments are stored privately and downloadable only by authorized officers', function () {
    Storage::fake('local');

    $officer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $officer->assignRole('grm_officer');

    $regularUser = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->post(route('grm.store'), [
        'complainant_name' => 'Private Attachment',
        'email' => 'private@example.com',
        'category' => 'other',
        'description' => 'This submission contains a private attachment for access control tests.',
        'attachments' => [
            UploadedFile::fake()->create('private-evidence.pdf', 64, 'application/pdf'),
        ],
    ])->assertRedirect();

    $case = GrmCase::query()->firstOrFail();
    $attachment = $case->attachments()->firstOrFail();

    Storage::disk('local')->assertExists($attachment->file_path);

    $this->actingAs($regularUser)
        ->get(route('admin.grm.attachments.download', [$case, $attachment]))
        ->assertForbidden();

    $this->actingAs($officer)
        ->get(route('admin.grm.attachments.download', [$case, $attachment]))
        ->assertOk();
});

test('read only grm viewers receive masked personal data and cannot download attachments', function () {
    Storage::fake('local');

    $viewer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $viewer->givePermissionTo('grm.view');

    $this->post(route('grm.store'), [
        'complainant_name' => 'Amina User',
        'email' => 'amina@example.com',
        'phone' => '+992900000000',
        'category' => 'other',
        'description' => 'This submission is used to verify masked GRM visibility for read only access.',
        'attachments' => [
            UploadedFile::fake()->create('identity-proof.pdf', 64, 'application/pdf'),
        ],
    ])->assertRedirect();

    $case = GrmCase::query()->firstOrFail();
    $attachment = $case->attachments()->firstOrFail();

    $this->actingAs($viewer)
        ->get(route('admin.grm.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/grm/index')
            ->where('cases.data.0.complainant_name', 'A**** U***')
        );

    $this->actingAs($viewer)
        ->get(route('admin.grm.show', $case))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/grm/show')
            ->where('case.complainant_name', 'A**** U***')
            ->where('case.complainant_email', 'am***@example.com')
            ->where('case.complainant_phone', '***********00')
            ->where('case.can_view_sensitive_data', false)
            ->where('case.can_update_status', false)
            ->where('case.can_message', false)
            ->where('case.attachments', [])
        );

    $this->actingAs($viewer)
        ->get(route('admin.grm.attachments.download', [$case, $attachment]))
        ->assertForbidden();
});

test('assigned grm cases can only be operated by the assigned officer or super admin', function () {
    Storage::fake('local');

    $assignedOfficer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $assignedOfficer->assignRole('grm_officer');

    $otherOfficer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $otherOfficer->assignRole('grm_officer');

    $superAdmin = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $superAdmin->assignRole('super_admin');

    $this->post(route('grm.store'), [
        'complainant_name' => 'Assigned Case',
        'email' => 'assigned@example.com',
        'phone' => '+992900001122',
        'category' => 'other',
        'description' => 'This submission is used to verify assignment aware GRM operational access.',
        'attachments' => [
            UploadedFile::fake()->create('assignment-evidence.pdf', 64, 'application/pdf'),
        ],
    ])->assertRedirect();

    $case = GrmCase::query()->firstOrFail();
    $case->update(['assigned_to' => $assignedOfficer->id]);
    $attachment = $case->attachments()->firstOrFail();

    $this->actingAs($otherOfficer)
        ->get(route('admin.grm.show', $case))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/grm/show')
            ->where('case.can_view_sensitive_data', false)
            ->where('case.can_update_status', false)
            ->where('case.can_message', false)
            ->where('case.attachments', [])
        );

    $this->actingAs($otherOfficer)
        ->patch(route('admin.grm.update-status', $case), [
            'status' => 'under_review',
        ])
        ->assertForbidden();

    $this->actingAs($otherOfficer)
        ->post(route('admin.grm.add-message', $case), [
            'message' => 'Attempting to access another officer case.',
        ])
        ->assertForbidden();

    $this->actingAs($otherOfficer)
        ->get(route('admin.grm.attachments.download', [$case, $attachment]))
        ->assertForbidden();

    $this->actingAs($assignedOfficer)
        ->patch(route('admin.grm.update-status', $case), [
            'status' => 'under_review',
            'officer_id' => $assignedOfficer->id,
        ])
        ->assertRedirect();

    $this->actingAs($assignedOfficer)
        ->post(route('admin.grm.add-message', $case), [
            'message' => 'Assigned officer response.',
        ])
        ->assertRedirect();

    $this->actingAs($assignedOfficer)
        ->get(route('admin.grm.attachments.download', [$case, $attachment]))
        ->assertOk();

    $this->actingAs($superAdmin)
        ->patch(route('admin.grm.update-status', $case), [
            'status' => 'resolved',
            'officer_id' => $assignedOfficer->id,
        ])
        ->assertRedirect();

    expect($case->fresh()->status)->toBe('resolved')
        ->and($case->messages()->count())->toBe(1);
});

test('grm operational actions create explicit audit log entries', function () {
    $officer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $officer->assignRole('grm_officer');

    $assignee = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $assignee->assignRole('grm_officer');

    $case = GrmCase::create([
        'ticket_number' => 'GRM-2026-00991',
        'tracking_token' => 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        'complainant_name' => 'Audit Citizen',
        'email' => 'audit@example.com',
        'category' => 'other',
        'description' => 'Audit verification grievance description.',
        'status' => 'submitted',
    ]);

    $this->actingAs($officer)
        ->patch(route('admin.grm.update-status', $case), [
            'status' => 'under_review',
            'officer_id' => $assignee->id,
            'notes' => 'Assigned for operational handling.',
        ])
        ->assertRedirect();

    $this->actingAs($assignee)
        ->post(route('admin.grm.add-message', $case), [
            'message' => 'Operational follow-up message.',
        ])
        ->assertRedirect();

    $statusAudit = AuditLog::query()
        ->where('action', 'grm.status_updated')
        ->where('entity_type', GrmCase::class)
        ->where('entity_id', $case->id)
        ->latest('id')
        ->first();

    $assignmentAudit = AuditLog::query()
        ->where('action', 'grm.assigned')
        ->where('entity_type', GrmCase::class)
        ->where('entity_id', $case->id)
        ->latest('id')
        ->first();

    $messageAudit = AuditLog::query()
        ->where('action', 'grm.message_added')
        ->where('entity_type', GrmCase::class)
        ->where('entity_id', $case->id)
        ->latest('id')
        ->first();

    expect($statusAudit)->not->toBeNull()
        ->and($statusAudit?->metadata)->toMatchArray([
            'ticket_number' => 'GRM-2026-00991',
            'from_status' => 'submitted',
            'to_status' => 'under_review',
            'assigned_to_before' => null,
            'assigned_to_after' => $assignee->id,
            'notes_present' => true,
        ])
        ->and($assignmentAudit)->not->toBeNull()
        ->and($assignmentAudit?->metadata)->toMatchArray([
            'ticket_number' => 'GRM-2026-00991',
            'assigned_to_before' => null,
            'assigned_to_after' => $assignee->id,
        ])
        ->and($messageAudit)->not->toBeNull()
        ->and($messageAudit?->metadata['ticket_number'])->toBe('GRM-2026-00991')
        ->and($messageAudit?->metadata['sender_type'])->toBe('officer')
        ->and($messageAudit?->metadata['message_length'])->toBe(mb_strlen('Operational follow-up message.'));
});

test('closing and reopening grm cases manages public tracking retention timestamps', function () {
    config(['grm.public_tracking_retention_days' => 45]);

    $officer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $officer->assignRole('grm_officer');

    $case = GrmCase::create([
        'ticket_number' => 'GRM-2026-00992',
        'tracking_token' => 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
        'complainant_name' => 'Retention Citizen',
        'email' => 'retention@example.com',
        'category' => 'other',
        'description' => 'Retention lifecycle verification case.',
        'status' => 'under_review',
    ]);

    $this->actingAs($officer)
        ->patch(route('admin.grm.update-status', $case), [
            'status' => 'closed',
            'officer_id' => $officer->id,
            'notes' => 'Closing the case.',
        ])
        ->assertRedirect();

    $closedCase = $case->fresh();

    expect($closedCase->closed_at)->not->toBeNull()
        ->and($closedCase->public_tracking_expires_at)->not->toBeNull()
        ->and($closedCase->public_tracking_expires_at?->equalTo(
            $closedCase->closed_at?->copy()->addDays(45)
        ))->toBeTrue();

    $this->actingAs($officer)
        ->patch(route('admin.grm.update-status', $closedCase), [
            'status' => 'under_review',
            'officer_id' => $officer->id,
            'notes' => 'Reopening the case.',
        ])
        ->assertRedirect();

    $reopenedCase = $closedCase->fresh();

    expect($reopenedCase->closed_at)->toBeNull()
        ->and($reopenedCase->public_tracking_expires_at)->toBeNull();
});

<?php

use App\Models\Activity;
use App\Models\ActivityTranslation;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\DocumentTranslation;
use App\Models\News;
use App\Models\NewsTranslation;
use App\Models\Page;
use App\Models\PageTranslation;
use App\Models\Procurement;
use App\Models\ProcurementTranslation;
use App\Models\Setting;
use App\Models\Tag;
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;

test('sitemap includes key public records and returns xml', function () {
    $page = Page::create([
        'slug' => 'compliance',
        'status' => 'published',
    ]);

    PageTranslation::create([
        'page_id' => $page->id,
        'language' => 'en',
        'title' => 'Compliance page',
        'content' => '<p>Content</p>',
    ]);

    $activity = Activity::create([
        'slug' => 'digital-rollout',
        'status' => 'completed',
    ]);

    ActivityTranslation::create([
        'activity_id' => $activity->id,
        'language' => 'en',
        'title' => 'Digital Rollout',
    ]);

    $news = News::create([
        'slug' => 'launch-update',
        'status' => 'published',
        'published_at' => now(),
    ]);

    NewsTranslation::create([
        'news_id' => $news->id,
        'language' => 'en',
        'title' => 'Launch Update',
    ]);

    $procurement = Procurement::create([
        'reference_number' => 'RFQ-2026-SEO',
        'status' => 'awarded',
        'publication_date' => now()->toDateString(),
    ]);

    ProcurementTranslation::create([
        'procurement_id' => $procurement->id,
        'language' => 'en',
        'title' => 'Awarded procurement',
    ]);

    $response = $this->get(route('sitemap'));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/xml; charset=UTF-8');
    $response->assertSee(route('home'), false);
    $response->assertSee(route('pages.show', ['slug' => 'compliance']), false);
    $response->assertSee(route('activities.show', ['slug' => 'digital-rollout']), false);
    $response->assertSee(route('news.show', ['slug' => 'launch-update']), false);
    $response->assertSee(route('procurement.show', ['ref' => 'RFQ-2026-SEO']), false);
});

test('public pages receive shared site settings for seo and analytics', function () {
    Setting::set('site_title', 'PIC Portal');
    Setting::set('site_description', 'Compliance-ready public portal');
    Setting::set('google_analytics_id', 'G-TEST1234');

    $page = Page::create([
        'slug' => 'seo-page',
        'status' => 'published',
    ]);

    PageTranslation::create([
        'page_id' => $page->id,
        'language' => 'en',
        'title' => 'SEO Page',
        'content' => '<p>SEO</p>',
    ]);

    $this->get(route('pages.show', ['slug' => 'seo-page']))
        ->assertOk()
        ->assertInertia(fn (Assert $inertia) => $inertia
            ->component('public/page')
            ->where('siteSettings.site_title', 'PIC Portal')
            ->where('siteSettings.site_description', 'Compliance-ready public portal')
            ->where('siteSettings.google_analytics_id', 'G-TEST1234')
        );
});

test('documents index filters published archive by year and search term', function () {
    $category = DocumentCategory::create([
        'name' => 'Policies',
        'slug' => 'policies',
    ]);

    $matchingDocument = Document::create([
        'category_id' => $category->id,
        'file_path' => 'documents/procurement-guidelines.pdf',
        'file_type' => 'pdf',
        'published_at' => now()->setYear(2026),
    ]);

    DocumentTranslation::create([
        'document_id' => $matchingDocument->id,
        'language' => 'en',
        'title' => 'Procurement Guidelines',
        'description' => 'Searchable compliance handbook',
    ]);

    $otherDocument = Document::create([
        'category_id' => $category->id,
        'file_path' => 'documents/legacy-plan.doc',
        'file_type' => 'doc',
        'published_at' => now()->setYear(2025),
    ]);

    DocumentTranslation::create([
        'document_id' => $otherDocument->id,
        'language' => 'en',
        'title' => 'Legacy Plan',
        'description' => 'Old archive item',
    ]);

    $this->get('/documents?year=2026&search=guidelines')
        ->assertOk()
        ->assertInertia(fn (Assert $inertia) => $inertia
            ->component('public/documents/index')
            ->where('documents.data.0.id', $matchingDocument->id)
            ->where('documents.data', fn (Collection $items) => $items->count() === 1)
            ->where('years.0', 2026)
        );
});

test('documents index exposes tag and file type filtering for published archive', function () {
    $category = DocumentCategory::create([
        'name' => 'Reports',
        'slug' => 'reports',
    ]);

    $policyTag = Tag::create([
        'name' => 'Policy',
        'slug' => 'policy',
    ]);

    $guidelineTag = Tag::create([
        'name' => 'Guideline',
        'slug' => 'guideline',
    ]);

    $matchingDocument = Document::create([
        'category_id' => $category->id,
        'file_path' => 'documents/implementation-policy.pdf',
        'file_type' => 'pdf',
        'published_at' => now()->setYear(2026),
    ]);
    $matchingDocument->tags()->attach($policyTag);

    DocumentTranslation::create([
        'document_id' => $matchingDocument->id,
        'language' => 'en',
        'title' => 'Implementation Policy',
        'description' => 'Tagged policy document',
    ]);

    $otherPublishedDocument = Document::create([
        'category_id' => $category->id,
        'file_path' => 'documents/guideline.docx',
        'file_type' => 'docx',
        'published_at' => now()->setYear(2026),
    ]);
    $otherPublishedDocument->tags()->attach($guidelineTag);

    DocumentTranslation::create([
        'document_id' => $otherPublishedDocument->id,
        'language' => 'en',
        'title' => 'Guideline Note',
        'description' => 'Tagged guideline document',
    ]);

    $draftDocument = Document::create([
        'category_id' => $category->id,
        'file_path' => 'documents/draft-policy.pdf',
        'file_type' => 'pdf',
        'published_at' => null,
    ]);
    $draftDocument->tags()->attach($policyTag);

    DocumentTranslation::create([
        'document_id' => $draftDocument->id,
        'language' => 'en',
        'title' => 'Draft Policy',
        'description' => 'Unpublished document should stay hidden',
    ]);

    $this->get('/documents?tag=policy&file_type=pdf')
        ->assertOk()
        ->assertInertia(fn (Assert $inertia) => $inertia
            ->component('public/documents/index')
            ->where('documents.data', fn (Collection $items) => $items->count() === 1 && $items->first()['id'] === $matchingDocument->id)
            ->where('tags.0.slug', 'guideline')
            ->where('tags.1.slug', 'policy')
            ->where('fileTypes.0', 'docx')
            ->where('fileTypes.1', 'pdf')
        );
});

<?php

use App\Models\News;
use App\Models\NewsTranslation;
use App\Models\Page;
use App\Models\PageTranslation;
use App\Models\SearchIndex;

test('published pages are synced into the public search index and removed when unpublished', function () {
    $page = Page::create([
        'slug' => 'compliance-roadmap',
        'status' => 'published',
        'published_at' => now(),
    ]);

    PageTranslation::create([
        'page_id' => $page->id,
        'language' => 'en',
        'title' => 'Compliance Roadmap',
        'content' => '<p>Initial roadmap content.</p>',
        'meta_title' => 'Roadmap',
        'meta_description' => 'Delivery roadmap',
    ]);

    $index = SearchIndex::query()
        ->where('entity_type', Page::class)
        ->where('entity_id', $page->id)
        ->where('language', 'en')
        ->first();

    expect($index)->not->toBeNull()
        ->and($index?->title)->toBe('Compliance Roadmap')
        ->and($index?->content)->toContain('Initial roadmap content.')
        ->and($index?->url)->toBe(route('pages.show', ['slug' => 'compliance-roadmap']));

    $translation = PageTranslation::query()
        ->where('page_id', $page->id)
        ->where('language', 'en')
        ->firstOrFail();

    $translation->update([
        'title' => 'Updated Compliance Roadmap',
        'content' => '<p>Updated roadmap content.</p>',
    ]);

    expect(SearchIndex::query()
        ->where('entity_type', Page::class)
        ->where('entity_id', $page->id)
        ->where('language', 'en')
        ->count())->toBe(1);

    expect(SearchIndex::query()
        ->where('entity_type', Page::class)
        ->where('entity_id', $page->id)
        ->where('language', 'en')
        ->value('title'))->toBe('Updated Compliance Roadmap');

    $page->update([
        'status' => 'draft',
        'published_at' => null,
    ]);

    expect(SearchIndex::query()
        ->where('entity_type', Page::class)
        ->where('entity_id', $page->id)
        ->count())->toBe(0);
});

test('deleted translations are removed from the search index while remaining translations stay searchable', function () {
    $page = Page::create([
        'slug' => 'project-overview',
        'status' => 'published',
        'published_at' => now(),
    ]);

    $english = PageTranslation::create([
        'page_id' => $page->id,
        'language' => 'en',
        'title' => 'Project Overview',
        'content' => '<p>English content.</p>',
    ]);

    $russian = PageTranslation::create([
        'page_id' => $page->id,
        'language' => 'ru',
        'title' => 'Обзор проекта',
        'content' => '<p>Russian content.</p>',
    ]);

    expect(SearchIndex::query()
        ->where('entity_type', Page::class)
        ->where('entity_id', $page->id)
        ->count())->toBe(2);

    $russian->delete();

    expect(SearchIndex::query()
        ->where('entity_type', Page::class)
        ->where('entity_id', $page->id)
        ->where('language', 'ru')
        ->exists())->toBeFalse()
        ->and(SearchIndex::query()
            ->where('entity_type', Page::class)
            ->where('entity_id', $page->id)
            ->where('language', 'en')
            ->exists())->toBeTrue();

    $english->delete();

    expect(SearchIndex::query()
        ->where('entity_type', Page::class)
        ->where('entity_id', $page->id)
        ->exists())->toBeFalse();
});

test('search reindex command rebuilds the index from current public content only', function () {
    SearchIndex::create([
        'entity_type' => Page::class,
        'entity_id' => 999,
        'title' => 'Stale entry',
        'content' => 'Old content',
        'language' => 'en',
        'url' => '/stale-entry',
    ]);

    $publishedNews = News::create([
        'slug' => 'launch-update',
        'status' => 'published',
        'published_at' => now(),
    ]);

    NewsTranslation::create([
        'news_id' => $publishedNews->id,
        'language' => 'en',
        'title' => 'Launch Update',
        'summary' => 'Important update',
        'content' => '<p>Published content.</p>',
    ]);

    $draftNews = News::create([
        'slug' => 'internal-draft',
        'status' => 'draft',
    ]);

    NewsTranslation::create([
        'news_id' => $draftNews->id,
        'language' => 'en',
        'title' => 'Internal Draft',
        'summary' => 'Should not be indexed',
        'content' => '<p>Draft content.</p>',
    ]);

    $this->artisan('search:reindex')
        ->assertSuccessful();

    expect(SearchIndex::query()
        ->where('title', 'Stale entry')
        ->exists())->toBeFalse()
        ->and(SearchIndex::query()
            ->where('entity_type', News::class)
            ->where('entity_id', $publishedNews->id)
            ->where('language', 'en')
            ->exists())->toBeTrue()
        ->and(SearchIndex::query()
            ->where('entity_type', News::class)
            ->where('entity_id', $draftNews->id)
            ->exists())->toBeFalse();
});

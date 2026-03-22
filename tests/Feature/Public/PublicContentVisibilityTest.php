<?php

use App\Models\Activity;
use App\Models\ActivityTranslation;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\DocumentTranslation;
use App\Models\News;
use App\Models\NewsTranslation;
use App\Models\Procurement;
use App\Models\ProcurementTranslation;
use App\Models\SearchIndex;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('public news index only returns published news even if a draft status is requested', function () {
    $publishedNews = News::create([
        'slug' => 'published-news',
        'status' => 'published',
        'published_at' => now(),
    ]);

    NewsTranslation::create([
        'news_id' => $publishedNews->id,
        'language' => 'en',
        'title' => 'Published News',
    ]);

    $draftNews = News::create([
        'slug' => 'draft-news',
        'status' => 'draft',
    ]);

    NewsTranslation::create([
        'news_id' => $draftNews->id,
        'language' => 'en',
        'title' => 'Draft News',
    ]);

    $this->get('/news?status=draft')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/news/index')
            ->where('news.data', fn (Collection $items) => $items->count() === 1 && $items->first()['slug'] === 'published-news')
            ->missing('filters.status')
        );
});

test('public activity show only resolves records through the public repository path', function () {
    $activity = Activity::create([
        'slug' => 'public-activity',
        'status' => 'completed',
    ]);

    ActivityTranslation::create([
        'activity_id' => $activity->id,
        'language' => 'en',
        'title' => 'Completed Activity',
    ]);

    $this->get('/activities/public-activity')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/activities/show')
            ->where('activity.slug', 'public-activity')
        );
});

test('public procurement index and detail expose public lifecycle statuses', function () {
    $openProcurement = Procurement::create([
        'reference_number' => 'OPEN-001',
        'status' => 'open',
        'publication_date' => now()->toDateString(),
        'deadline' => now()->addDays(5)->toDateString(),
    ]);

    ProcurementTranslation::create([
        'procurement_id' => $openProcurement->id,
        'language' => 'en',
        'title' => 'Open Procurement',
    ]);

    $closedProcurement = Procurement::create([
        'reference_number' => 'CLOSED-001',
        'status' => 'closed',
        'publication_date' => now()->toDateString(),
    ]);

    ProcurementTranslation::create([
        'procurement_id' => $closedProcurement->id,
        'language' => 'en',
        'title' => 'Closed Procurement',
    ]);

    $expiredOpenProcurement = Procurement::create([
        'reference_number' => 'OPEN-EXPIRED-001',
        'status' => 'open',
        'publication_date' => now()->subDays(10)->toDateString(),
        'deadline' => now()->subDay()->toDateString(),
    ]);

    ProcurementTranslation::create([
        'procurement_id' => $expiredOpenProcurement->id,
        'language' => 'en',
        'title' => 'Expired Open Procurement',
    ]);

    $this->get('/procurement?status=closed')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/procurement/index')
            ->where('filters.status', 'closed')
            ->where('procurements.data', fn (Collection $items) => $items->count() === 1 && $items->first()['reference_number'] === 'CLOSED-001')
        );

    $this->get('/procurement')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/procurement/index')
            ->where('procurements.data', function (Collection $items) {
                $open = $items->firstWhere('reference_number', 'OPEN-001');
                $expired = $items->firstWhere('reference_number', 'OPEN-EXPIRED-001');

                return $open !== null
                    && $open['process_state'] === 'submission_open'
                    && $open['is_submission_open'] === true
                    && $open['deadline_passed'] === false
                    && is_int($open['days_until_deadline'])
                    && $expired !== null
                    && $expired['process_state'] === 'deadline_passed'
                    && $expired['is_submission_open'] === false
                    && $expired['deadline_passed'] === true
                    && $expired['days_until_deadline'] === null;
            })
        );

    $this->get('/procurement/OPEN-001')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/procurement/show')
            ->where('procurement.reference_number', 'OPEN-001')
            ->where('procurement.process_state', 'submission_open')
            ->where('procurement.is_submission_open', true)
        );

    $this->get('/procurement/CLOSED-001')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/procurement/show')
            ->where('procurement.reference_number', 'CLOSED-001')
            ->where('procurement.process_state', 'under_evaluation')
            ->where('procurement.is_submission_open', false)
        );
});

test('default about and project pages are available after database seeding', function () {
    $this->seed(DatabaseSeeder::class);

    $this->get('/about')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/page')
            ->where('page.slug', 'about')
        );

    $this->get('/project')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/page')
            ->where('page.slug', 'project')
        );
});

test('public news prioritizes featured announcements and shares a whats new stream', function () {
    $featuredNews = News::create([
        'slug' => 'featured-announcement',
        'status' => 'published',
        'is_featured' => true,
        'published_at' => now()->subDays(10),
    ]);

    NewsTranslation::create([
        'news_id' => $featuredNews->id,
        'language' => 'en',
        'title' => 'Featured Announcement',
        'summary' => 'Important featured update',
    ]);

    $recentNews = News::create([
        'slug' => 'recent-update',
        'status' => 'published',
        'is_featured' => false,
        'published_at' => now()->subDays(2),
    ]);

    NewsTranslation::create([
        'news_id' => $recentNews->id,
        'language' => 'en',
        'title' => 'Recent Update',
        'summary' => 'Fresh project update',
    ]);

    $olderNews = News::create([
        'slug' => 'older-update',
        'status' => 'published',
        'is_featured' => false,
        'published_at' => now()->subDays(30),
    ]);

    NewsTranslation::create([
        'news_id' => $olderNews->id,
        'language' => 'en',
        'title' => 'Older Update',
        'summary' => 'Older project update',
    ]);

    $this->get('/news')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/news/index')
            ->where('news.data.0.slug', 'featured-announcement')
            ->where('featuredAnnouncements', fn (Collection $items) => $items->pluck('slug')->all() === [
                'featured-announcement',
                'recent-update',
            ])
            ->where('recentWindowDays', 14)
        );

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
            ->where('whatsNew', fn (Collection $items) => $items->pluck('slug')->all() === [
                'featured-announcement',
                'recent-update',
            ])
            ->where('newsRecentWindowDays', 14)
        );
});

test('public search uses the current locale, exposes entity filters, and returns snippets', function () {
    SearchIndex::create([
        'entity_type' => \App\Models\News::class,
        'entity_id' => 101,
        'title' => 'Digital Identity Rollout',
        'content' => str_repeat('Intro text. ', 8).'The digital identity rollout expands online access for citizens.'.str_repeat(' Closing note.', 8),
        'language' => 'en',
        'url' => '/news/digital-identity-rollout',
    ]);

    SearchIndex::create([
        'entity_type' => \App\Models\Page::class,
        'entity_id' => 202,
        'title' => 'Project Overview',
        'content' => 'General project overview content.',
        'language' => 'en',
        'url' => '/project',
    ]);

    SearchIndex::create([
        'entity_type' => \App\Models\News::class,
        'entity_id' => 303,
        'title' => 'Запуск цифровой идентификации',
        'content' => 'Русскоязычный материал не должен попасть в английскую выдачу.',
        'language' => 'ru',
        'url' => '/news/ru-digital-identity',
    ]);

    $this->get('/search?q=digital&lang=en&entity_type='.urlencode(\App\Models\News::class))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/search')
            ->where('query', 'digital')
            ->where('filters.lang', 'en')
            ->where('entityTypes', fn (Collection $items) => $items->pluck('value')->contains(\App\Models\News::class))
            ->where('results.total', 1)
            ->where('results.data.0.title', 'Digital Identity Rollout')
            ->where('results.data.0.entity_label_key', 'search.entity.news')
            ->where('results.data.0.snippet', fn (string $snippet) => str_contains($snippet, 'digital identity rollout'))
        );
});

test('public search includes document and media entity filters for indexed public records', function () {
    SearchIndex::create([
        'entity_type' => \App\Models\Document::class,
        'entity_id' => 404,
        'title' => 'Implementation Handbook',
        'content' => 'Public implementation handbook for project delivery.',
        'language' => 'en',
        'url' => '/documents/404/download',
    ]);

    SearchIndex::create([
        'entity_type' => \App\Models\MediaItem::class,
        'entity_id' => 505,
        'title' => 'Launch Gallery',
        'content' => 'Official gallery from the launch event.',
        'language' => 'en',
        'url' => '/media#media-item-505',
    ]);

    $this->get('/search?q=public&lang=en')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/search')
            ->where('entityTypes', fn (Collection $items) => $items->pluck('value')->contains(\App\Models\Document::class)
                && $items->firstWhere('value', \App\Models\Document::class)['count'] === 1)
            ->where('results.data', fn (Collection $items) => $items->pluck('entity_type')->contains(\App\Models\Document::class))
        );
});

test('public search keeps query string filters in paginator links', function () {
    foreach (range(1, 16) as $index) {
        SearchIndex::create([
            'entity_type' => \App\Models\News::class,
            'entity_id' => 600 + $index,
            'title' => "Portal Update {$index}",
            'content' => 'Project portal update content for pagination coverage.',
            'language' => 'en',
            'url' => "/news/portal-update-{$index}",
        ]);
    }

    SearchIndex::create([
        'entity_type' => \App\Models\Page::class,
        'entity_id' => 800,
        'title' => 'Portal Overview',
        'content' => 'A general portal overview page.',
        'language' => 'en',
        'url' => '/project',
    ]);

    $this->get('/search?q=portal&lang=en&entity_type='.urlencode(\App\Models\News::class))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/search')
            ->where('results.current_page', 1)
            ->where('results.last_page', 2)
            ->where('results.next_page_url', fn (?string $url) => $url !== null
                && str_contains($url, 'q=portal')
                && str_contains($url, 'lang=en')
                && str_contains($url, urlencode(\App\Models\News::class)))
            ->where('entityTypes', fn (Collection $items) => $items->count() === 2
                && $items->firstWhere('value', \App\Models\News::class)['count'] === 16
                && $items->firstWhere('value', \App\Models\Page::class)['count'] === 1)
        );
});

test('language switch stores the locale in session and shares it with inertia', function () {
    $this->seed(DatabaseSeeder::class);

    $this->from('/about')
        ->get(route('language.switch', ['locale' => 'ru']))
        ->assertRedirect('/about');

    $this->get('/about')
        ->assertOk()
        ->assertSessionHas('locale', 'ru')
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/page')
            ->where('locale', 'ru')
            ->where('page.slug', 'about')
        );
});

test('public pages accept lang query parameters and persist the locale for follow-up requests', function () {
    $this->seed(DatabaseSeeder::class);

    $this->get('/about?lang=tj')
        ->assertOk()
        ->assertSessionHas('locale', 'tj')
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/page')
            ->where('locale', 'tj')
            ->where('page.slug', 'about')
        );

    $this->get('/project')
        ->assertOk()
        ->assertSessionHas('locale', 'tj')
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/page')
            ->where('locale', 'tj')
            ->where('page.slug', 'project')
        );
});

test('public archive paginators preserve lang query parameters for localized listings', function () {
    $category = DocumentCategory::create([
        'name' => 'Reports',
        'slug' => 'reports',
    ]);

    foreach (range(1, 16) as $index) {
        $document = Document::create([
            'category_id' => $category->id,
            'file_path' => "documents/report-{$index}.pdf",
            'file_type' => 'pdf',
            'published_at' => now()->subDays($index),
        ]);

        DocumentTranslation::create([
            'document_id' => $document->id,
            'language' => 'tj',
            'title' => "Ҳисобот {$index}",
        ]);
    }

    foreach (range(1, 16) as $index) {
        $procurement = Procurement::create([
            'reference_number' => sprintf('TJ-%03d', $index),
            'status' => 'open',
            'publication_date' => now()->subDays($index)->toDateString(),
            'deadline' => now()->addDays(30 - $index)->toDateString(),
        ]);

        ProcurementTranslation::create([
            'procurement_id' => $procurement->id,
            'language' => 'tj',
            'title' => "Харид {$index}",
        ]);
    }

    $this->get('/documents?lang=tj')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/documents/index')
            ->where('filters.lang', 'tj')
            ->where('documents.next_page_url', fn (?string $url) => $url !== null && str_contains($url, 'lang=tj'))
        );

    $this->get('/procurement?lang=tj')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/procurement/index')
            ->where('filters.lang', 'tj')
            ->where('procurements.next_page_url', fn (?string $url) => $url !== null && str_contains($url, 'lang=tj'))
        );
});

test('document downloads preserve a safe filename with the original extension', function () {
    Storage::fake('public');

    $category = DocumentCategory::create([
        'name' => 'Policies',
        'slug' => 'policies',
    ]);

    $file = UploadedFile::fake()->create('implementation-guidelines.pdf', 32, 'application/pdf');
    $storedPath = $file->storeAs('documents', 'implementation-guidelines.pdf', 'public');

    $document = Document::create([
        'category_id' => $category->id,
        'file_path' => $storedPath,
        'file_type' => 'pdf',
        'published_at' => now(),
    ]);

    DocumentTranslation::create([
        'document_id' => $document->id,
        'language' => 'en',
        'title' => 'Implementation Guidelines 2026',
    ]);

    $this->get(route('documents.download', $document))
        ->assertOk()
        ->assertDownload('Implementation Guidelines 2026.pdf');
});

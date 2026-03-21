<?php

use App\Models\Activity;
use App\Models\ActivityTranslation;
use App\Models\News;
use App\Models\NewsTranslation;
use App\Models\Procurement;
use App\Models\ProcurementTranslation;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Collection;
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

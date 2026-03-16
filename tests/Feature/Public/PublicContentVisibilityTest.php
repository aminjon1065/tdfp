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

test('public procurement index and detail only expose open records', function () {
    $openProcurement = Procurement::create([
        'reference_number' => 'OPEN-001',
        'status' => 'open',
        'publication_date' => now()->toDateString(),
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

    $this->get('/procurement?status=closed')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/procurement/index')
            ->where('procurements.data', fn (Collection $items) => $items->count() === 1 && $items->first()['reference_number'] === 'OPEN-001')
            ->missing('filters.status')
        );

    $this->get('/procurement/OPEN-001')->assertOk();
    $this->get('/procurement/CLOSED-001')->assertNotFound();
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

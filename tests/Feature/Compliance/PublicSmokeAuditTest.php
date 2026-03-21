<?php

use App\Core\Services\PublicSmokeAuditService;
use App\Models\Activity;
use App\Models\ActivityTranslation;
use App\Models\News;
use App\Models\NewsTranslation;
use App\Models\Page;
use App\Models\PageTranslation;
use App\Models\Procurement;
use App\Models\ProcurementTranslation;
use Database\Seeders\CmsPageSeeder;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

test('public smoke audit passes across profiles for seeded public routes and records', function () {
    $this->seed(CmsPageSeeder::class);

    $page = Page::create([
        'slug' => 'compliance-evidence',
        'status' => 'published',
    ]);

    PageTranslation::create([
        'page_id' => $page->id,
        'language' => 'en',
        'title' => 'Compliance Evidence',
        'content' => '<p>Published page.</p>',
    ]);

    $activity = Activity::create([
        'slug' => 'connectivity-expansion',
        'status' => 'completed',
    ]);

    ActivityTranslation::create([
        'activity_id' => $activity->id,
        'language' => 'en',
        'title' => 'Connectivity Expansion',
    ]);

    $news = News::create([
        'slug' => 'platform-rollout',
        'status' => 'published',
        'published_at' => now(),
    ]);

    NewsTranslation::create([
        'news_id' => $news->id,
        'language' => 'en',
        'title' => 'Platform Rollout',
        'summary' => 'Published update',
    ]);

    $procurement = Procurement::create([
        'reference_number' => 'RFQ-SMOKE-001',
        'status' => 'open',
        'publication_date' => now()->toDateString(),
    ]);

    ProcurementTranslation::create([
        'procurement_id' => $procurement->id,
        'language' => 'en',
        'title' => 'Smoke Test Procurement',
    ]);

    $results = app(PublicSmokeAuditService::class)->audit();

    expect($results)->not->toBeEmpty()
        ->and(collect($results)->where('ok', false))->toHaveCount(0);

    $this->artisan('public:smoke-audit')
        ->assertSuccessful();
});

test('public smoke audit surfaces non-200 responses from registered public urls', function () {
    $this->seed(CmsPageSeeder::class);

    $realKernel = app(Kernel::class);

    app()->instance(Kernel::class, new class($realKernel) implements Kernel
    {
        public function __construct(private Kernel $kernel) {}

        public function bootstrap(): void
        {
            $this->kernel->bootstrap();
        }

        public function handle($request): Response
        {
            if ($request instanceof Request && $request->getPathInfo() === '/media') {
                return response('Injected smoke failure', 500);
            }

            return $this->kernel->handle($request);
        }

        public function terminate($request, $response): void
        {
            $this->kernel->terminate($request, $response);
        }

        public function getApplication()
        {
            return $this->kernel->getApplication();
        }
    });

    $results = app(PublicSmokeAuditService::class)->audit();
    $failures = collect($results)->where('ok', false);

    expect($failures)->not->toBeEmpty()
        ->and($failures->pluck('status')->contains(500))->toBeTrue()
        ->and($failures->pluck('url')->contains(route('media.index')))->toBeTrue();

    $this->artisan('public:smoke-audit')
        ->assertFailed();
});

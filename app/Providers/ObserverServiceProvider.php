<?php

namespace App\Providers;

use App\Core\Observers\AuditObserver;
use App\Models\Activity;
use App\Models\ActivityTranslation;
use App\Models\Document;
use App\Models\DocumentTranslation;
use App\Models\GrmCase;
use App\Models\MediaItem;
use App\Models\MediaItemTranslation;
use App\Models\News;
use App\Models\NewsTranslation;
use App\Models\Page;
use App\Models\PageTranslation;
use App\Models\Procurement;
use App\Models\ProcurementTranslation;
use App\Observers\SearchIndexObserver;
use Illuminate\Support\ServiceProvider;

class ObserverServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Page::observe(AuditObserver::class);
        News::observe(AuditObserver::class);
        Activity::observe(AuditObserver::class);
        Document::observe(AuditObserver::class);
        Procurement::observe(AuditObserver::class);
        GrmCase::observe(AuditObserver::class);

        Page::observe(SearchIndexObserver::class);
        News::observe(SearchIndexObserver::class);
        Activity::observe(SearchIndexObserver::class);
        Document::observe(SearchIndexObserver::class);
        MediaItem::observe(SearchIndexObserver::class);
        Procurement::observe(SearchIndexObserver::class);
        PageTranslation::observe(SearchIndexObserver::class);
        NewsTranslation::observe(SearchIndexObserver::class);
        ActivityTranslation::observe(SearchIndexObserver::class);
        DocumentTranslation::observe(SearchIndexObserver::class);
        MediaItemTranslation::observe(SearchIndexObserver::class);
        ProcurementTranslation::observe(SearchIndexObserver::class);
    }
}

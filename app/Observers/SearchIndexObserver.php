<?php

namespace App\Observers;

use App\Jobs\SyncSearchIndexJob;
use App\Models\Activity;
use App\Models\ActivityTranslation;
use App\Models\Document;
use App\Models\DocumentTranslation;
use App\Models\MediaItem;
use App\Models\MediaItemTranslation;
use App\Models\News;
use App\Models\NewsTranslation;
use App\Models\Page;
use App\Models\PageTranslation;
use App\Models\Procurement;
use App\Models\ProcurementTranslation;

class SearchIndexObserver
{
    public function saved(mixed $model): void
    {
        $this->sync($model);
    }

    public function deleted(mixed $model): void
    {
        $this->sync($model);
    }

    public function forceDeleted(mixed $model): void
    {
        $this->sync($model);
    }

    private function sync(mixed $model): void
    {
        if ($model instanceof Page || $model instanceof News || $model instanceof Activity || $model instanceof Procurement || $model instanceof Document || $model instanceof MediaItem) {
            $this->dispatch($model::class, (int) $model->getKey());

            return;
        }

        [$entityType, $entityId] = match (true) {
            $model instanceof PageTranslation => [Page::class, (int) $model->page_id],
            $model instanceof NewsTranslation => [News::class, (int) $model->news_id],
            $model instanceof ActivityTranslation => [Activity::class, (int) $model->activity_id],
            $model instanceof ProcurementTranslation => [Procurement::class, (int) $model->procurement_id],
            $model instanceof DocumentTranslation => [Document::class, (int) $model->document_id],
            $model instanceof MediaItemTranslation => [MediaItem::class, (int) $model->media_item_id],
            default => [null, null],
        };

        if (is_string($entityType) && is_int($entityId) && $entityId > 0) {
            $this->dispatch($entityType, $entityId);
        }
    }

    private function dispatch(string $entityType, int $entityId): void
    {
        SyncSearchIndexJob::dispatch($entityType, $entityId);
    }
}

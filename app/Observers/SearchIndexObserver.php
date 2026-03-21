<?php

namespace App\Observers;

use App\Models\Activity;
use App\Models\ActivityTranslation;
use App\Models\News;
use App\Models\NewsTranslation;
use App\Models\Page;
use App\Models\PageTranslation;
use App\Models\Procurement;
use App\Models\ProcurementTranslation;
use App\Modules\Search\Services\SearchService;

class SearchIndexObserver
{
    public function __construct(
        private SearchService $searchService,
    ) {}

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
        if ($model instanceof Page || $model instanceof News || $model instanceof Activity || $model instanceof Procurement) {
            if ($model->exists) {
                $this->searchService->syncModel($model);
            } else {
                $this->searchService->remove($model::class, (int) $model->getKey());
            }

            return;
        }

        $parentModel = match (true) {
            $model instanceof PageTranslation => $model->page()->with('translations')->first(),
            $model instanceof NewsTranslation => $model->news()->with('translations')->first(),
            $model instanceof ActivityTranslation => $model->activity()->with('translations')->first(),
            $model instanceof ProcurementTranslation => $model->procurement()->with('translations')->first(),
            default => null,
        };

        if ($parentModel !== null) {
            $this->searchService->syncModel($parentModel);
        }
    }
}

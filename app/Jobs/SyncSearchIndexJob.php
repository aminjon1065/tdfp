<?php

namespace App\Jobs;

use App\Modules\Search\Services\SearchService;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Queue\Queueable;

class SyncSearchIndexJob implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $uniqueFor = 60;

    public function __construct(
        public string $entityType,
        public int $entityId,
    ) {
        $this->onQueue('search');
    }

    public function uniqueId(): string
    {
        return sprintf('%s:%d', $this->entityType, $this->entityId);
    }

    public function handle(SearchService $searchService): void
    {
        if (! class_exists($this->entityType)) {
            return;
        }

        $model = $this->entityType::query()->find($this->entityId);

        if ($model instanceof Model) {
            $searchService->syncModel($model);

            return;
        }

        $searchService->remove($this->entityType, $this->entityId);
    }
}

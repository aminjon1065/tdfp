<?php

namespace App\Modules\Search\Services;

use App\Models\Activity;
use App\Models\News;
use App\Models\Page;
use App\Models\Procurement;
use App\Models\SearchIndex;
use Illuminate\Pagination\LengthAwarePaginator;

class SearchService
{
    public function search(string $query, string $language = 'en', array $filters = []): LengthAwarePaginator
    {
        $searchTerm = trim($query);

        $q = SearchIndex::query()
            ->where('language', $language)
            ->where(function ($builder) use ($searchTerm) {
                $builder->where('title', 'like', '%'.$searchTerm.'%')
                    ->orWhere('content', 'like', '%'.$searchTerm.'%');
            });

        if (! empty($filters['entity_type'])) {
            $q->where('entity_type', $filters['entity_type']);
        }

        return $q
            ->orderByRaw(
                'CASE WHEN title LIKE ? THEN 0 WHEN title LIKE ? THEN 1 ELSE 2 END',
                [$searchTerm, '%'.$searchTerm.'%']
            )
            ->latest('updated_at')
            ->paginate(15);
    }

    public function index(string $entityType, int $entityId, string $title, ?string $content, string $language, string $url): void
    {
        SearchIndex::updateOrCreate(
            ['entity_type' => $entityType, 'entity_id' => $entityId, 'language' => $language],
            ['title' => $title, 'content' => $content, 'url' => $url]
        );
    }

    public function remove(string $entityType, int $entityId): void
    {
        SearchIndex::where('entity_type', $entityType)->where('entity_id', $entityId)->delete();
    }

    /**
     * @return array<int, array{value: string, label_key: string}>
     */
    public function availableEntityTypes(string $language = 'en'): array
    {
        return SearchIndex::query()
            ->where('language', $language)
            ->select('entity_type')
            ->distinct()
            ->orderBy('entity_type')
            ->pluck('entity_type')
            ->filter(fn (string $entityType) => $this->entityTypeLabelKey($entityType) !== null)
            ->map(fn (string $entityType) => [
                'value' => $entityType,
                'label_key' => $this->entityTypeLabelKey($entityType),
            ])
            ->values()
            ->all();
    }

    public function entityTypeLabelKey(string $entityType): ?string
    {
        return match ($entityType) {
            Page::class => 'search.entity.page',
            News::class => 'search.entity.news',
            Activity::class => 'search.entity.activity',
            Procurement::class => 'search.entity.procurement',
            default => null,
        };
    }
}

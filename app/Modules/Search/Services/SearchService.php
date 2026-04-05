<?php

namespace App\Modules\Search\Services;

use App\ActivityStatus;
use App\Models\Activity;
use App\Models\Document;
use App\Models\MediaItem;
use App\Models\News;
use App\Models\Page;
use App\Models\Procurement;
use App\Models\SearchIndex;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Expression;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class SearchService
{
    public function search(string $query, string $language = 'en', array $filters = []): LengthAwarePaginator
    {
        $searchTerm = trim($query);

        if ($this->canUseFullText($searchTerm)) {
            $fullTextResults = $this->buildFullTextSearchQuery($searchTerm, $language, $filters)
                ->paginate(15)
                ->withQueryString();

            if ($fullTextResults->total() > 0) {
                return $fullTextResults;
            }
        }

        return $this->buildLikeSearchQuery($searchTerm, $language, $filters)
            ->paginate(15)
            ->withQueryString();
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
     * @return array<int, array{value: string, label_key: string, count: int}>
     */
    public function availableEntityTypes(string $language = 'en', ?string $query = null): array
    {
        $counts = $query !== null && trim($query) !== ''
            ? $this->facetCounts(trim($query), $language)
            : [];

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
                'count' => $counts[$entityType] ?? 0,
            ])
            ->filter(fn (array $entityType) => $query === null || trim($query) === '' || $entityType['count'] > 0)
            ->values()
            ->all();
    }

    /**
     * @return array<string, int>
     */
    public function facetCounts(string $query, string $language = 'en'): array
    {
        $searchTerm = trim($query);
        $fullTextCounts = [];

        if ($this->canUseFullText($searchTerm)) {
            $fullTextCounts = $this->entityTypeCounts(
                $this->buildFullTextSearchQuery($searchTerm, $language)
            );
        }

        if ($fullTextCounts !== []) {
            return $fullTextCounts;
        }

        return $this->entityTypeCounts(
            $this->buildLikeSearchQuery($searchTerm, $language)
        );
    }

    /**
     * @return array<string, int>
     */
    private function entityTypeCounts(Builder $query): array
    {
        return $query
            ->reorder()
            ->select('entity_type', new Expression('COUNT(*) as aggregate'))
            ->groupBy('entity_type')
            ->pluck('aggregate', 'entity_type')
            ->map(fn (mixed $count) => (int) $count)
            ->all();
    }

    public function entityTypeLabelKey(string $entityType): ?string
    {
        return match ($entityType) {
            Page::class => 'search.entity.page',
            News::class => 'search.entity.news',
            Activity::class => 'search.entity.activity',
            Procurement::class => 'search.entity.procurement',
            Document::class => 'search.entity.document',
            MediaItem::class => 'search.entity.media',
            default => null,
        };
    }

    public function syncModel(Model $model): void
    {
        if (! $this->supportsModel($model)) {
            return;
        }

        if (! $this->isPubliclySearchable($model)) {
            $this->remove($model::class, (int) $model->getKey());

            return;
        }

        $model->loadMissing('translations');

        $indexedLanguages = [];

        foreach ($model->translations as $translation) {
            $title = trim((string) ($translation->title ?? ''));

            if ($title === '') {
                continue;
            }

            $language = (string) $translation->language;

            $this->index(
                $model::class,
                (int) $model->getKey(),
                $title,
                $this->searchableContent($model, $translation),
                $language,
                $this->publicUrl($model)
            );

            $indexedLanguages[] = $language;
        }

        SearchIndex::query()
            ->where('entity_type', $model::class)
            ->where('entity_id', $model->getKey())
            ->when(
                $indexedLanguages !== [],
                fn ($query) => $query->whereNotIn('language', $indexedLanguages),
                fn ($query) => $query
            )
            ->delete();
    }

    public function reindexAll(): void
    {
        SearchIndex::query()->delete();

        $this->reindexQuery(Page::query()->with('translations'));
        $this->reindexQuery(News::query()->with('translations'));
        $this->reindexQuery(Activity::query()->with('translations'));
        $this->reindexQuery(Procurement::query()->with('translations'));
        $this->reindexQuery(Document::query()->with('translations'));
        $this->reindexQuery(MediaItem::query()->with('translations'));
    }

    private function reindexQuery($query): void
    {
        $query->chunkById(100, function (Collection $models): void {
            $models->each(fn (Model $model) => $this->syncModel($model));
        });
    }

    private function buildBaseSearchQuery(string $language, array $filters = []): Builder
    {
        return SearchIndex::query()
            ->where('language', $language)
            ->when(
                ! empty($filters['entity_type']),
                fn ($query) => $query->where('entity_type', $filters['entity_type'])
            );
    }

    private function buildFullTextSearchQuery(string $searchTerm, string $language, array $filters = []): Builder
    {
        return $this->buildBaseSearchQuery($language, $filters)
            ->select('search_index.*')
            ->selectRaw(
                'MATCH(title, content) AGAINST (? IN NATURAL LANGUAGE MODE) as relevance_score',
                [$searchTerm],
            )
            ->whereFullText(['title', 'content'], $searchTerm)
            ->orderByDesc('relevance_score')
            ->latest('updated_at');
    }

    private function buildLikeSearchQuery(string $searchTerm, string $language, array $filters = []): Builder
    {
        return $this->buildBaseSearchQuery($language, $filters)
            ->where(function ($builder) use ($searchTerm) {
                $builder->where('title', 'like', '%'.$searchTerm.'%')
                    ->orWhere('content', 'like', '%'.$searchTerm.'%');
            })
            ->orderByRaw(
                'CASE
                    WHEN LOWER(title) = LOWER(?) THEN 0
                    WHEN LOWER(title) LIKE LOWER(?) THEN 1
                    WHEN LOWER(title) LIKE LOWER(?) THEN 2
                    WHEN LOWER(content) LIKE LOWER(?) THEN 3
                    ELSE 4
                END',
                [
                    $searchTerm,
                    $searchTerm.'%',
                    '%'.$searchTerm.'%',
                    '%'.$searchTerm.'%',
                ]
            )
            ->orderByRaw('LENGTH(title) asc')
            ->latest('updated_at');
    }

    private function canUseFullText(string $searchTerm): bool
    {
        if (mb_strlen($searchTerm) < 3) {
            return false;
        }

        $terms = preg_split('/[\s\p{P}\p{S}]+/u', $searchTerm, -1, PREG_SPLIT_NO_EMPTY);

        if (! is_array($terms) || $terms === []) {
            return false;
        }

        return collect(Arr::where($terms, fn (string $term) => mb_strlen($term) >= 3))->isNotEmpty();
    }

    private function supportsModel(Model $model): bool
    {
        return in_array($model::class, [
            Page::class,
            News::class,
            Activity::class,
            Procurement::class,
            Document::class,
            MediaItem::class,
        ], true);
    }

    private function isPubliclySearchable(Model $model): bool
    {
        return match ($model::class) {
            Page::class => $model->status === 'published',
            News::class => $model->status === 'published',
            Activity::class => ActivityStatus::isPublic($model->status),
            Procurement::class => in_array($model->status, ['open', 'closed', 'awarded', 'archived'], true),
            Document::class => $model->published_at !== null,
            MediaItem::class => $model->is_public === true,
            default => false,
        };
    }

    private function searchableContent(Model $model, object $translation): ?string
    {
        return match ($model::class) {
            Page::class => $this->joinContent([
                $translation->meta_title ?? null,
                $translation->meta_description ?? null,
                $translation->content ?? null,
            ]),
            News::class => $this->joinContent([
                $translation->summary ?? null,
                $translation->content ?? null,
            ]),
            Activity::class => $this->joinContent([
                $translation->description ?? null,
                $translation->objectives ?? null,
            ]),
            Procurement::class => $this->joinContent([
                $model->reference_number,
                $translation->description ?? null,
            ]),
            Document::class => $this->joinContent([
                $translation->description ?? null,
                $model->file_type,
            ]),
            MediaItem::class => $this->joinContent([
                $translation->description ?? null,
                $model->type,
            ]),
            default => null,
        };
    }

    private function publicUrl(Model $model): string
    {
        return match ($model::class) {
            Page::class => $model->slug === 'about'
                ? route('about')
                : route('pages.show', ['slug' => $model->slug]),
            News::class => route('news.show', ['slug' => $model->slug]),
            Activity::class => route('activities.show', ['slug' => $model->slug]),
            Procurement::class => route('procurement.show', ['ref' => $model->reference_number]),
            Document::class => route('documents.download', ['document' => $model->getKey()]),
            MediaItem::class => route('media.index').'#media-item-'.$model->getKey(),
            default => '/',
        };
    }

    /**
     * @param  array<int, mixed>  $parts
     */
    private function joinContent(array $parts): ?string
    {
        $content = collect($parts)
            ->map(fn (mixed $part) => trim(strip_tags((string) $part)))
            ->filter()
            ->implode("\n\n");

        return $content !== '' ? $content : null;
    }
}

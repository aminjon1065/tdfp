<?php

namespace App\Modules\Search\Services;

use App\Models\Activity;
use App\Models\Document;
use App\Models\MediaItem;
use App\Models\News;
use App\Models\Page;
use App\Models\Procurement;
use App\Models\SearchIndex;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

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
            Activity::class => in_array($model->status, ['planned', 'in_progress', 'completed'], true),
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
            Page::class => match ($model->slug) {
                'about' => route('about'),
                'project' => route('project'),
                default => route('pages.show', ['slug' => $model->slug]),
            },
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

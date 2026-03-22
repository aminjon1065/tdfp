<?php

namespace App\Modules\Documents\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Models\Document;
use App\Models\Tag;
use Illuminate\Pagination\LengthAwarePaginator;

class DocumentRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Document);
    }

    public function paginateWithRelations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Document::with('translations', 'category', 'uploader')->latest();
        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }
        if (! empty($filters['search'])) {
            $query->whereHas('translations', fn ($q) => $q->where('title', 'like', '%'.$filters['search'].'%'));
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function paginatePublishedWithRelations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Document::with('translations', 'category', 'uploader', 'tags')
            ->whereNotNull('published_at')
            ->latest('published_at');

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (! empty($filters['year'])) {
            $query->whereYear('published_at', (int) $filters['year']);
        }

        if (! empty($filters['file_type'])) {
            $query->where('file_type', $filters['file_type']);
        }

        if (! empty($filters['tag'])) {
            $query->whereHas('tags', fn ($tagQuery) => $tagQuery->where('slug', $filters['tag']));
        }

        if (! empty($filters['search'])) {
            $query->where(function ($builder) use ($filters) {
                $builder->where('file_type', 'like', '%'.$filters['search'].'%')
                    ->orWhereHas('category', fn ($categoryQuery) => $categoryQuery
                        ->where('name', 'like', '%'.$filters['search'].'%'))
                    ->orWhereHas('tags', fn ($tagQuery) => $tagQuery
                        ->where('name', 'like', '%'.$filters['search'].'%')
                        ->orWhere('slug', 'like', '%'.$filters['search'].'%'))
                    ->orWhereHas('translations', fn ($translationQuery) => $translationQuery
                        ->where('title', 'like', '%'.$filters['search'].'%')
                        ->orWhere('description', 'like', '%'.$filters['search'].'%'));
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function findByIdWithRelations(int $id): ?Document
    {
        return Document::with('translations', 'category', 'tags')->find($id);
    }

    public function isPublished(Document $document): bool
    {
        return ! is_null($document->published_at);
    }

    public function latestPublished(int $limit = 6): \Illuminate\Database\Eloquent\Collection
    {
        return Document::with('translations', 'category')
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function incrementDownload(Document $document): void
    {
        $document->increment('download_count');
    }

    /**
     * @return list<int>
     */
    public function publicArchiveYears(): array
    {
        return Document::query()
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->pluck('published_at')
            ->filter()
            ->map(fn ($publishedAt) => (int) \Illuminate\Support\Carbon::parse($publishedAt)->format('Y'))
            ->unique()
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    public function publicFileTypes(): array
    {
        return Document::query()
            ->whereNotNull('published_at')
            ->whereNotNull('file_type')
            ->select('file_type')
            ->distinct()
            ->orderBy('file_type')
            ->pluck('file_type')
            ->filter()
            ->values()
            ->all();
    }

    public function publicTags()
    {
        return Tag::query()
            ->select('tags.id', 'tags.name', 'tags.slug')
            ->join('taggables', 'taggables.tag_id', '=', 'tags.id')
            ->join('documents', function ($join) {
                $join->on('documents.id', '=', 'taggables.taggable_id')
                    ->where('taggables.taggable_type', '=', Document::class);
            })
            ->whereNotNull('documents.published_at')
            ->distinct()
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);
    }
}

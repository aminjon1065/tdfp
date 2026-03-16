<?php

namespace App\Modules\Documents\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Models\Document;
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

        return $query->paginate($perPage);
    }

    public function paginatePublishedWithRelations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Document::with('translations', 'category', 'uploader')
            ->whereNotNull('published_at')
            ->latest();

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (! empty($filters['search'])) {
            $query->whereHas('translations', fn ($builder) => $builder->where('title', 'like', '%'.$filters['search'].'%'));
        }

        return $query->paginate($perPage);
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
}

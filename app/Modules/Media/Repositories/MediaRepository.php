<?php

namespace App\Modules\Media\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Models\MediaItem;
use Illuminate\Pagination\LengthAwarePaginator;

class MediaRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new MediaItem);
    }

    public function paginateWithRelations(int $perPage = 24, array $filters = []): LengthAwarePaginator
    {
        $query = MediaItem::with('translations', 'uploader')->latest();

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->paginate($perPage);
    }

    public function paginatePublicWithRelations(int $perPage = 24, array $filters = []): LengthAwarePaginator
    {
        $query = MediaItem::query()
            ->with('translations', 'uploader')
            ->where('is_public', true)
            ->latest();

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->paginate($perPage);
    }

    public function latestImages(int $limit = 8): \Illuminate\Database\Eloquent\Collection
    {
        return MediaItem::with('translations')
            ->where('is_public', true)
            ->where('type', 'image')
            ->latest()
            ->limit($limit)
            ->get();
    }
}

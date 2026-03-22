<?php

namespace App\Modules\News\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Models\News;
use Illuminate\Pagination\LengthAwarePaginator;

class NewsRepository extends BaseRepository
{
    /**
     * @var list<string>
     */
    private array $publicStatuses = ['published'];

    private const RECENT_DAYS_WINDOW = 14;

    public function __construct()
    {
        parent::__construct(new News);
    }

    public function paginateWithTranslations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = News::with('translations', 'category', 'author')->latest();

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }
        if (! empty($filters['search'])) {
            $query->whereHas('translations', fn ($q) => $q->where('title', 'like', '%'.$filters['search'].'%'));
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function paginatePublishedWithTranslations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = News::with('translations', 'category', 'author')
            ->whereIn('status', $this->publicStatuses)
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at');

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (! empty($filters['search'])) {
            $query->whereHas('translations', fn ($builder) => $builder->where('title', 'like', '%'.$filters['search'].'%'));
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function findBySlug(string $slug): ?News
    {
        return News::with('translations', 'category', 'author', 'tags')->where('slug', $slug)->first();
    }

    public function findPublishedBySlug(string $slug): ?News
    {
        return News::with('translations', 'category', 'author')->where('slug', $slug)->where('status', 'published')->first();
    }

    public function latestPublished(int $limit = 6): \Illuminate\Database\Eloquent\Collection
    {
        return News::with('translations', 'category')
            ->where('status', 'published')
            ->orderByDesc('is_featured')
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function featuredAnnouncements(int $limit = 4): \Illuminate\Database\Eloquent\Collection
    {
        return News::with('translations', 'category')
            ->where('status', 'published')
            ->where(function ($query) {
                $query->where('is_featured', true)
                    ->orWhere('published_at', '>=', now()->subDays(self::RECENT_DAYS_WINDOW));
            })
            ->orderByDesc('is_featured')
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get();
    }

    public function recentWindowDays(): int
    {
        return self::RECENT_DAYS_WINDOW;
    }
}

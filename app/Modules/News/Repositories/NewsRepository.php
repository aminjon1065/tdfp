<?php
namespace App\Modules\News\Repositories;
use App\Core\Repositories\BaseRepository;
use App\Models\News;
use Illuminate\Pagination\LengthAwarePaginator;

class NewsRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new News());
    }

    public function paginateWithTranslations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = News::with('translations', 'category', 'author')->latest();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }
        if (!empty($filters['search'])) {
            $query->whereHas('translations', fn($q) => $q->where('title', 'like', '%'.$filters['search'].'%'));
        }

        return $query->paginate($perPage);
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
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }
}

<?php
namespace App\Modules\Activities\Repositories;
use App\Core\Repositories\BaseRepository;
use App\Models\Activity;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ActivityRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Activity());
    }

    public function paginateWithTranslations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Activity::with('translations')->latest();
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        return $query->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Activity
    {
        return Activity::with('translations', 'documents.translations', 'news.translations')->where('slug', $slug)->first();
    }

    public function findPublishedBySlug(string $slug): ?Activity
    {
        return Activity::with('translations', 'documents.translations', 'news.translations')->where('slug', $slug)->first();
    }

    public function allWithTranslations(): Collection
    {
        return Activity::with('translations')->orderBy('created_at', 'desc')->get();
    }
}

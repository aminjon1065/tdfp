<?php

namespace App\Modules\Activities\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Models\Activity;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ActivityRepository extends BaseRepository
{
    /**
     * @var list<string>
     */
    private array $publicStatuses = ['planned', 'in_progress', 'completed'];

    public function __construct()
    {
        parent::__construct(new Activity);
    }

    public function paginateWithTranslations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Activity::with('translations')->latest();
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function paginatePublicWithTranslations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Activity::with('translations')
            ->whereIn('status', $this->publicStatuses)
            ->latest();

        if (! empty($filters['status']) && in_array($filters['status'], $this->publicStatuses, true)) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['domain'])) {
            $query->where('domain_slug', $filters['domain']);
        }

        if (! empty($filters['search'])) {
            $term = $filters['search'];
            $query->whereHas('translations', fn ($q) => $q->where('title', 'like', "%{$term}%"));
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function findBySlug(string $slug): ?Activity
    {
        return Activity::with('translations', 'documents.translations', 'news.translations')->where('slug', $slug)->first();
    }

    public function findPublishedBySlug(string $slug): ?Activity
    {
        return Activity::with('translations', 'documents.translations', 'news.translations')
            ->where('slug', $slug)
            ->whereIn('status', $this->publicStatuses)
            ->first();
    }

    public function allPublicWithTranslations(): Collection
    {
        return Activity::with('translations')
            ->whereIn('status', $this->publicStatuses)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}

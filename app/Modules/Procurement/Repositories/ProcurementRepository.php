<?php

namespace App\Modules\Procurement\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Models\Procurement;
use Illuminate\Pagination\LengthAwarePaginator;

class ProcurementRepository extends BaseRepository
{
    /**
     * @var list<string>
     */
    private array $publicStatuses = ['open', 'closed', 'awarded', 'archived'];

    public function __construct()
    {
        parent::__construct(new Procurement);
    }

    public function paginateWithRelations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Procurement::with('translations', 'creator')->latest();
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (! empty($filters['search'])) {
            $query->where('reference_number', 'like', '%'.$filters['search'].'%')
                ->orWhereHas('translations', fn ($q) => $q->where('title', 'like', '%'.$filters['search'].'%'));
        }

        return $query->paginate($perPage);
    }

    public function paginatePublicWithRelations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Procurement::with('translations', 'creator')
            ->whereIn('status', $this->publicStatuses)
            ->latest();

        if (! empty($filters['status']) && in_array($filters['status'], $this->publicStatuses, true)) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['year'])) {
            $query->whereYear('publication_date', (int) $filters['year']);
        }

        if (! empty($filters['search'])) {
            $query->where(function ($builder) use ($filters) {
                $builder->where('reference_number', 'like', '%'.$filters['search'].'%')
                    ->orWhereHas('translations', fn ($translationQuery) => $translationQuery
                        ->where('title', 'like', '%'.$filters['search'].'%')
                        ->orWhere('description', 'like', '%'.$filters['search'].'%'));
            });
        }

        return $query->paginate($perPage);
    }

    public function findByRefOrId(string $ref): ?Procurement
    {
        return Procurement::with('translations', 'documents.translations')->where('reference_number', $ref)->first();
    }

    public function findPublicByRef(string $ref): ?Procurement
    {
        return Procurement::with('translations', 'documents.translations')
            ->where('reference_number', $ref)
            ->whereIn('status', $this->publicStatuses)
            ->first();
    }

    public function openProcurements(int $limit = 5): \Illuminate\Database\Eloquent\Collection
    {
        return Procurement::with('translations')
            ->where('status', 'open')
            ->orderBy('deadline', 'asc')
            ->limit($limit)
            ->get();
    }

    /**
     * @return list<int>
     */
    public function publicArchiveYears(): array
    {
        return Procurement::query()
            ->whereIn('status', $this->publicStatuses)
            ->whereNotNull('publication_date')
            ->selectRaw('DISTINCT YEAR(publication_date) as year')
            ->orderByDesc('year')
            ->pluck('year')
            ->map(fn ($year) => (int) $year)
            ->all();
    }
}

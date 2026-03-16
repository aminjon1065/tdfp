<?php

namespace App\Modules\Procurement\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Models\Procurement;
use Illuminate\Pagination\LengthAwarePaginator;

class ProcurementRepository extends BaseRepository
{
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

    public function paginateOpenWithRelations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Procurement::with('translations', 'creator')
            ->where('status', 'open')
            ->latest();

        if (! empty($filters['search'])) {
            $query->where(function ($builder) use ($filters) {
                $builder->where('reference_number', 'like', '%'.$filters['search'].'%')
                    ->orWhereHas('translations', fn ($translationQuery) => $translationQuery->where('title', 'like', '%'.$filters['search'].'%'));
            });
        }

        return $query->paginate($perPage);
    }

    public function findByRefOrId(string $ref): ?Procurement
    {
        return Procurement::with('translations', 'documents.translations')->where('reference_number', $ref)->first();
    }

    public function findOpenByRef(string $ref): ?Procurement
    {
        return Procurement::with('translations', 'documents.translations')
            ->where('reference_number', $ref)
            ->where('status', 'open')
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
}

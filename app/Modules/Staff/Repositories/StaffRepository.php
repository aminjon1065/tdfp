<?php

namespace App\Modules\Staff\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Models\StaffMember;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class StaffRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new StaffMember);
    }

    public function paginateWithRelations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return StaffMember::query()
            ->with(['translations', 'parent.translations'])
            ->when($filters['search'] ?? null, function ($query, string $search) {
                $query->where(function ($builder) use ($search) {
                    $builder->where('email', 'like', '%'.$search.'%')
                        ->orWhere('phone', 'like', '%'.$search.'%')
                        ->orWhereHas('translations', fn ($translationQuery) => $translationQuery
                            ->where('full_name', 'like', '%'.$search.'%')
                            ->orWhere('job_title', 'like', '%'.$search.'%')
                            ->orWhere('department', 'like', '%'.$search.'%'));
                });
            })
            ->orderByDesc('is_leadership')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate($perPage);
    }

    public function findByIdWithRelations(int $id): ?StaffMember
    {
        return StaffMember::query()
            ->with(['translations', 'parent.translations'])
            ->find($id);
    }

    public function parentOptions(?int $exceptId = null): Collection
    {
        return StaffMember::query()
            ->with('translations')
            ->when($exceptId !== null, fn ($query) => $query->whereKeyNot($exceptId))
            ->orderByDesc('is_leadership')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    public function publicHierarchy(): Collection
    {
        return StaffMember::query()
            ->with('translations')
            ->where('is_published', true)
            ->orderByDesc('is_leadership')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }
}

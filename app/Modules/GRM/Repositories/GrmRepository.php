<?php
namespace App\Modules\GRM\Repositories;
use App\Core\Repositories\BaseRepository;
use App\Models\GrmCase;
use Illuminate\Pagination\LengthAwarePaginator;

class GrmRepository extends BaseRepository
{
    public function __construct() { parent::__construct(new GrmCase()); }

    public function paginateWithRelations(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = GrmCase::with('assignee')->latest();
        if (!empty($filters['status'])) $query->where('status', $filters['status']);
        if (!empty($filters['category'])) $query->where('category', $filters['category']);
        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('ticket_number', 'like', '%'.$filters['search'].'%')
                  ->orWhere('complainant_name', 'like', '%'.$filters['search'].'%')
                  ->orWhere('email', 'like', '%'.$filters['search'].'%');
            });
        }
        return $query->paginate($perPage);
    }

    public function findByTicket(string $ticket): ?GrmCase
    {
        return GrmCase::with('messages.officer', 'attachments', 'statusHistory.changedBy', 'assignee')
            ->where('ticket_number', $ticket)->first();
    }

    public function findWithRelations(int $id): ?GrmCase
    {
        return GrmCase::with('messages.officer', 'attachments', 'statusHistory.changedBy', 'assignee')->find($id);
    }

    public function openCount(): int
    {
        return GrmCase::whereIn('status', ['submitted', 'under_review', 'investigation'])->count();
    }
}

<?php

namespace App\Modules\Subscriptions\Repositories;

use App\Models\EmailSubscriber;
use Illuminate\Pagination\LengthAwarePaginator;

class SubscriptionRepository
{
    public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator
    {
        return EmailSubscriber::query()
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where('email', 'like', '%'.$search.'%'))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }
}

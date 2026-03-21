<?php

namespace App\Modules\Subscriptions\Repositories;

use App\Models\EmailSubscriber;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\LazyCollection;

class SubscriptionRepository
{
    public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator
    {
        return $this->query($filters)
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function streamExport(array $filters = []): LazyCollection
    {
        return $this->query($filters)
            ->orderBy('id')
            ->lazyById();
    }

    private function query(array $filters = []): Builder
    {
        return EmailSubscriber::query()
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['search'] ?? null, fn (Builder $query, string $search) => $query->where('email', 'like', '%'.$search.'%'));
    }
}

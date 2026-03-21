<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->trim()->value() ?: null,
            'action' => $request->string('action')->trim()->value() ?: null,
            'entity_type' => $request->string('entity_type')->trim()->value() ?: null,
            'user_id' => $request->integer('user_id') ?: null,
            'date_from' => $request->string('date_from')->trim()->value() ?: null,
            'date_to' => $request->string('date_to')->trim()->value() ?: null,
        ];

        $logs = AuditLog::query()
            ->with('user')
            ->when($filters['search'], function (Builder $query, string $search): void {
                $query->where(function (Builder $nestedQuery) use ($search): void {
                    $nestedQuery
                        ->where('action', 'like', "%{$search}%")
                        ->orWhere('entity_type', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhere('entity_id', 'like', "%{$search}%")
                        ->orWhereHas('user', fn (Builder $userQuery) => $userQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($filters['action'], fn (Builder $query, string $action) => $query->where('action', $action))
            ->when($filters['entity_type'], fn (Builder $query, string $entityType) => $query->where('entity_type', $entityType))
            ->when($filters['user_id'], fn (Builder $query, int $userId) => $query->where('user_id', $userId))
            ->when($filters['date_from'], fn (Builder $query, string $dateFrom) => $query->whereDate('created_at', '>=', $dateFrom))
            ->when($filters['date_to'], fn (Builder $query, string $dateTo) => $query->whereDate('created_at', '<=', $dateTo))
            ->latest('created_at')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('admin/audit-logs/index', [
            'logs' => $logs,
            'filters' => $filters,
            'actions' => AuditLog::query()
                ->select('action')
                ->distinct()
                ->orderBy('action')
                ->pluck('action')
                ->values(),
            'entityTypes' => AuditLog::query()
                ->whereNotNull('entity_type')
                ->select('entity_type')
                ->distinct()
                ->orderBy('entity_type')
                ->pluck('entity_type')
                ->values(),
            'users' => User::query()
                ->whereIn('id', AuditLog::query()->whereNotNull('user_id')->select('user_id'))
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }
}

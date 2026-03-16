<?php

namespace App\Core\Observers;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditObserver
{
    public function created(Model $model): void
    {
        $this->log('created', $model);
    }

    public function updated(Model $model): void
    {
        $this->log('updated', $model, ['changes' => $model->getChanges()]);
    }

    public function deleted(Model $model): void
    {
        $this->log('deleted', $model);
    }

    private function log(string $action, Model $model, array $metadata = []): void
    {
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'entity_type' => $model::class,
            'entity_id' => $model->getKey(),
            'metadata' => $metadata ?: null,
            'ip_address' => Request::ip(),
            'created_at' => now(),
        ]);
    }
}

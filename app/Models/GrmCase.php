<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GrmCase extends Model
{
    protected $fillable = [
        'ticket_number',
        'tracking_token',
        'complainant_name',
        'email',
        'phone',
        'category',
        'description',
        'status',
        'assigned_to',
        'closed_at',
        'public_tracking_expires_at',
    ];

    protected function casts(): array
    {
        return [
            'closed_at' => 'datetime',
            'public_tracking_expires_at' => 'datetime',
        ];
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(GrmMessage::class, 'case_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(GrmAttachment::class, 'case_id');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(GrmStatusHistory::class, 'case_id')->orderBy('created_at', 'asc');
    }

    public function hasExpiredPublicTracking(): bool
    {
        return $this->public_tracking_expires_at !== null
            && $this->public_tracking_expires_at->isPast();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrmCase extends Model
{
    protected $fillable = [
        'ticket_number',
        'complainant_name',
        'email',
        'phone',
        'category',
        'description',
        'status',
        'assigned_to',
    ];

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
}

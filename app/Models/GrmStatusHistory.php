<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrmStatusHistory extends Model
{
    protected $table = 'grm_status_history';

    protected $fillable = [
        'case_id',
        'status',
        'changed_by',
        'notes',
    ];

    public function case(): BelongsTo
    {
        return $this->belongsTo(GrmCase::class, 'case_id');
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}

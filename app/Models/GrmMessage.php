<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrmMessage extends Model
{
    protected $fillable = [
        'case_id',
        'sender_type',
        'officer_id',
        'message',
    ];

    public function case(): BelongsTo
    {
        return $this->belongsTo(GrmCase::class, 'case_id');
    }

    public function officer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'officer_id');
    }
}

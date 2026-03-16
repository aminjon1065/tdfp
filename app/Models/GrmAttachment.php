<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrmAttachment extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'case_id',
        'file_path',
        'original_name',
        'uploaded_at',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    public function case(): BelongsTo
    {
        return $this->belongsTo(GrmCase::class, 'case_id');
    }
}

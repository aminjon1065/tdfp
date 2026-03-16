<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaItem extends Model
{
    protected $fillable = [
        'type',
        'file_path',
        'thumbnail',
        'embed_url',
        'uploaded_by',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(MediaItemTranslation::class);
    }

    public function translation(string $lang = 'en'): ?MediaItemTranslation
    {
        return $this->translations->firstWhere('language', $lang);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}

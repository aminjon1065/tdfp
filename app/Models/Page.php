<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Page extends Model
{
    protected $fillable = [
        'slug',
        'status',
        'created_by',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(PageTranslation::class);
    }

    public function translation(string $lang = 'en'): ?PageTranslation
    {
        return $this->translations->firstWhere('language', $lang);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }
}

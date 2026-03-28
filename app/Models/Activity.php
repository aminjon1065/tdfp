<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

class Activity extends Model
{
    protected $fillable = [
        'slug',
        'status',
        'domain_slug',
        'activity_number',
        'start_date',
        'end_date',
        'featured_image',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(ActivityTranslation::class);
    }

    public function translation(string $lang = 'en'): ?ActivityTranslation
    {
        return $this->translations->firstWhere('language', $lang);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function news(): BelongsToMany
    {
        return $this->belongsToMany(News::class, 'activity_news');
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'activity_document');
    }

    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Document extends Model
{
    protected $fillable = [
        'category_id',
        'file_path',
        'file_type',
        'file_size',
        'download_count',
        'uploaded_by',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(DocumentTranslation::class);
    }

    public function translation(string $lang = 'en'): ?DocumentTranslation
    {
        return $this->translations->firstWhere('language', $lang);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(DocumentCategory::class, 'category_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'activity_document');
    }

    public function news(): BelongsToMany
    {
        return $this->belongsToMany(News::class, 'news_document');
    }

    public function procurements(): BelongsToMany
    {
        return $this->belongsToMany(Procurement::class, 'procurement_documents');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable', 'taggables');
    }
}

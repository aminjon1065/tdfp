<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Procurement extends Model
{
    protected $fillable = [
        'reference_number',
        'status',
        'publication_date',
        'deadline',
        'created_by',
    ];

    protected $casts = [
        'publication_date' => 'date',
        'deadline' => 'date',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(ProcurementTranslation::class);
    }

    public function translation(string $lang = 'en'): ?ProcurementTranslation
    {
        return $this->translations->firstWhere('language', $lang);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'procurement_documents');
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', 'open');
    }
}

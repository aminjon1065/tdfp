<?php

namespace App\Models;

use App\Core\Helpers\FileHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StaffMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'created_by',
        'email',
        'phone',
        'photo_path',
        'is_leadership',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'is_leadership' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order')->orderBy('id');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(StaffMemberTranslation::class);
    }

    public function translation(string $lang = 'en'): ?StaffMemberTranslation
    {
        return $this->translations->firstWhere('language', $lang);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function photoUrl(): ?string
    {
        return FileHelper::url($this->photo_path);
    }
}

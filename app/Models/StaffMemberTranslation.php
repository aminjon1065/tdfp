<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffMemberTranslation extends Model
{
    protected $fillable = [
        'staff_member_id',
        'language',
        'full_name',
        'job_title',
        'department',
        'biography',
    ];

    public function staffMember(): BelongsTo
    {
        return $this->belongsTo(StaffMember::class);
    }
}

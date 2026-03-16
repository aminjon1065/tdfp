<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchIndex extends Model
{
    protected $table = 'search_index';

    protected $fillable = [
        'entity_type',
        'entity_id',
        'title',
        'content',
        'language',
        'url',
    ];
}

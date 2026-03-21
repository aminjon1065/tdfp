<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('search_index', function (Blueprint $table) {
            $table->unique(
                ['entity_type', 'entity_id', 'language'],
                'search_index_entity_language_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('search_index', function (Blueprint $table) {
            $table->dropUnique('search_index_entity_language_unique');
        });
    }
};

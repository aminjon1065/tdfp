<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media_items', function (Blueprint $table) {
            $table->boolean('is_public')->default(true)->after('type');
            $table->string('file_path')->nullable()->change();
        });

        DB::table('media_items')
            ->where('file_path', 'like', 'media/editor-images/%')
            ->update(['is_public' => false]);
    }

    public function down(): void
    {
        Schema::table('media_items', function (Blueprint $table) {
            $table->dropColumn('is_public');
            $table->string('file_path')->nullable(false)->change();
        });
    }
};

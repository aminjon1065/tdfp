<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->string('domain_slug')->nullable()->after('status');
            $table->unsignedSmallInteger('activity_number')->nullable()->after('domain_slug');
            $table->index('domain_slug');
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->dropIndex(['domain_slug']);
            $table->dropColumn(['domain_slug', 'activity_number']);
        });
    }
};

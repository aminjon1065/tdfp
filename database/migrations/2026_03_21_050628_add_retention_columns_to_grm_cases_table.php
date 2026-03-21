<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('grm_cases', function (Blueprint $table) {
            $table->timestamp('closed_at')->nullable()->after('assigned_to');
            $table->timestamp('public_tracking_expires_at')->nullable()->after('closed_at');

            $table->index('closed_at');
            $table->index('public_tracking_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grm_cases', function (Blueprint $table) {
            $table->dropIndex(['closed_at']);
            $table->dropIndex(['public_tracking_expires_at']);
            $table->dropColumn(['closed_at', 'public_tracking_expires_at']);
        });
    }
};

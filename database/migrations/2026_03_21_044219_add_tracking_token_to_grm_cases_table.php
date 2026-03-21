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
            $table->string('tracking_token', 32)->nullable()->after('ticket_number');
            $table->index('tracking_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grm_cases', function (Blueprint $table) {
            $table->dropIndex(['tracking_token']);
            $table->dropColumn('tracking_token');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->enum('status', ['planned', 'in_progress', 'completed'])->default('planned');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('featured_image')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('status');
            $table->index('slug');
        });

        Schema::create('activity_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained()->cascadeOnDelete();
            $table->enum('language', ['tj', 'ru', 'en']);
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('objectives')->nullable();
            $table->timestamps();

            $table->unique(['activity_id', 'language']);
            $table->index('language');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_translations');
        Schema::dropIfExists('activities');
    }
};

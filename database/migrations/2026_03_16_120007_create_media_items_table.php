<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_items', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['image', 'video'])->default('image');
            $table->string('file_path');
            $table->string('thumbnail')->nullable();
            $table->string('embed_url')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('type');
        });

        Schema::create('media_item_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_item_id')->constrained()->cascadeOnDelete();
            $table->enum('language', ['tj', 'ru', 'en']);
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['media_item_id', 'language']);
            $table->index('language');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_item_translations');
        Schema::dropIfExists('media_items');
    }
};

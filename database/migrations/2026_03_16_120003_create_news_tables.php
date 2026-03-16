<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->foreignId('category_id')->nullable()->constrained('news_categories')->nullOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('featured_image')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('slug');
            $table->index('published_at');
        });

        Schema::create('news_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_id')->constrained()->cascadeOnDelete();
            $table->enum('language', ['tj', 'ru', 'en']);
            $table->string('title');
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->timestamps();

            $table->unique(['news_id', 'language']);
            $table->index('language');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_translations');
        Schema::dropIfExists('news');
        Schema::dropIfExists('news_categories');
    }
};

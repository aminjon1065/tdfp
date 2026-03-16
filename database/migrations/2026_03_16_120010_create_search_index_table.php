<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('search_index', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type');
            $table->unsignedBigInteger('entity_id');
            $table->string('title');
            $table->text('content')->nullable();
            $table->enum('language', ['tj', 'ru', 'en'])->default('en');
            $table->string('url')->nullable();
            $table->timestamps();

            $table->index(['entity_type', 'entity_id']);
            $table->index('language');
            $table->fullText(['title', 'content']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_index');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Activity ↔ News
        Schema::create('activity_news', function (Blueprint $table) {
            $table->foreignId('activity_id')->constrained()->cascadeOnDelete();
            $table->foreignId('news_id')->constrained()->cascadeOnDelete();
            $table->primary(['activity_id', 'news_id']);
        });

        // Activity ↔ Documents
        Schema::create('activity_document', function (Blueprint $table) {
            $table->foreignId('activity_id')->constrained()->cascadeOnDelete();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->primary(['activity_id', 'document_id']);
        });

        // News ↔ Documents
        Schema::create('news_document', function (Blueprint $table) {
            $table->foreignId('news_id')->constrained()->cascadeOnDelete();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->primary(['news_id', 'document_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_document');
        Schema::dropIfExists('activity_document');
        Schema::dropIfExists('activity_news');
    }
};

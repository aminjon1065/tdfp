<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('procurements', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();
            $table->enum('status', ['open', 'closed', 'awarded', 'archived'])->default('open');
            $table->date('publication_date')->nullable();
            $table->date('deadline')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('status');
            $table->index('reference_number');
            $table->index('deadline');
        });

        Schema::create('procurement_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('procurement_id')->constrained()->cascadeOnDelete();
            $table->enum('language', ['tj', 'ru', 'en']);
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['procurement_id', 'language']);
            $table->index('language');
        });

        Schema::create('procurement_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('procurement_id')->constrained()->cascadeOnDelete();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();

            $table->unique(['procurement_id', 'document_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procurement_documents');
        Schema::dropIfExists('procurement_translations');
        Schema::dropIfExists('procurements');
    }
};

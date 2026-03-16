<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grm_cases', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->string('complainant_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->enum('category', [
                'procurement',
                'project_implementation',
                'environment_social',
                'corruption',
                'other',
            ])->default('other');
            $table->text('description');
            $table->enum('status', [
                'submitted',
                'under_review',
                'investigation',
                'resolved',
                'closed',
            ])->default('submitted');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('ticket_number');
            $table->index('status');
            $table->index('email');
        });

        Schema::create('grm_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_id')->constrained('grm_cases')->cascadeOnDelete();
            $table->enum('sender_type', ['user', 'officer']);
            $table->foreignId('officer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('message');
            $table->timestamps();

            $table->index('case_id');
        });

        Schema::create('grm_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_id')->constrained('grm_cases')->cascadeOnDelete();
            $table->string('file_path');
            $table->string('original_name')->nullable();
            $table->timestamp('uploaded_at')->useCurrent();

            $table->index('case_id');
        });

        Schema::create('grm_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_id')->constrained('grm_cases')->cascadeOnDelete();
            $table->string('status');
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('case_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grm_status_history');
        Schema::dropIfExists('grm_attachments');
        Schema::dropIfExists('grm_messages');
        Schema::dropIfExists('grm_cases');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->enum('status', ['pending', 'active', 'unsubscribed'])->default('pending');
            $table->string('locale', 2)->default('en');
            $table->string('source')->default('public_form');
            $table->string('confirmation_token', 64)->nullable();
            $table->string('unsubscribe_token', 64)->nullable();
            $table->string('subscribed_ip', 45)->nullable();
            $table->string('confirmed_ip', 45)->nullable();
            $table->string('unsubscribed_ip', 45)->nullable();
            $table->timestamp('confirmation_sent_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('confirmed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_subscribers');
    }
};

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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('story_id'); // Reference to the story
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Reference to the user
            $table->string('comment_id')->nullable(); // Reference to the comment
            $table->string('comment_user_id')->nullable(); // Reference to the comment
            $table->enum('status', ['unread', 'read'])->default('unread');
            $table->enum('notification_type', ['comment', 'like', 'feature']);
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};

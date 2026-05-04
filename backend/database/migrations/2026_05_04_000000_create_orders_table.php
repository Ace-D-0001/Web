<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['draft', 'assigned', 'confirmed', 'completed', 'cancelled'])->default('draft');
            $table->decimal('total_price', 10, 2)->default(0);
            $table->text('notes')->nullable();               // Admin internal notes
            $table->text('cancel_reason')->nullable();

            $table->timestamp('assigned_at')->nullable();     // When admin assigned to user
            $table->timestamp('confirmed_at')->nullable();    // When user confirmed
            $table->timestamp('completed_at')->nullable();    // When admin marked complete
            $table->timestamp('cancelled_at')->nullable();    // When cancellation happened
            $table->foreignId('cancelled_by')->nullable()->constrained('users')->onDelete('set null');  // WHO cancelled

            $table->softDeletes();
            $table->timestamps();

            $table->index('status');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

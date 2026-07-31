<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('unit')->default('kg');
            $table->integer('quantity_available')->default(0);
            $table->string('status')->default('draft');
            $table->text('tags')->nullable();
            $table->timestamps();

            $table->index(['farmer_id']);
            $table->index(['category_id']);
            $table->index(['status']);
            $table->index(['price']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

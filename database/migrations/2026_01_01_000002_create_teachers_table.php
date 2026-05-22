<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('surname');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('school_code')->nullable();
            $table->string('school');
            $table->string('designation')->nullable();
            $table->string('nin');
            $table->text('subjects_taught');
            $table->string('appointment_letter_path');
            $table->string('account_number');
            $table->string('account_name');
            $table->string('bank');
            $table->string('bank_name');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};

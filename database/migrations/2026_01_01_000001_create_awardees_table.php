<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('awardees', function (Blueprint $table) {
            $table->id();
            $table->string('school_code', 8)->nullable();
            $table->string('surname');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('school');
            $table->string('nin');
            $table->string('account_number');
            $table->string('account_name');
            $table->string('bank');
            $table->string('bank_name');
            $table->string('status')->default('pending'); // pending, verified, rejected
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('awardees');
    }
};

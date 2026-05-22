<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('awardees', function (Blueprint $table) {
            if (!Schema::hasColumn('awardees', 'school_code')) {
                $table->string('school_code', 8)->nullable()->after('id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('awardees', function (Blueprint $table) {
            if (Schema::hasColumn('awardees', 'school_code')) {
                $table->dropColumn('school_code');
            }
        });
    }
};

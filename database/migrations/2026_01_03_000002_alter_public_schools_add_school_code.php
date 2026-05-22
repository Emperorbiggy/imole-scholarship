<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('public_schools', function (Blueprint $table) {
            if (!Schema::hasColumn('public_schools', 'school_code')) {
                $table->string('school_code', 8)->nullable()->after('school');
            }
        });
    }

    public function down(): void
    {
        Schema::table('public_schools', function (Blueprint $table) {
            if (Schema::hasColumn('public_schools', 'school_code')) {
                $table->dropColumn('school_code');
            }
        });
    }
};

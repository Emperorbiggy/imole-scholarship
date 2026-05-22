<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('private_schools', function (Blueprint $table) {
            if (!Schema::hasColumn('private_schools', 'school_code')) {
                $table->string('school_code', 8)->nullable()->after('school');
            }
            if (!Schema::hasColumn('private_schools', 'bill_id')) {
                $table->string('bill_id')->nullable()->after('school_code');
            }
            if (!Schema::hasColumn('private_schools', 'bill_invoice_status')) {
                $table->string('bill_invoice_status')->default('pending')->after('bill_id');
            }
            if (Schema::hasColumn('private_schools', 'tax_clearance_no')) {
                $table->dropColumn('tax_clearance_no');
            }
        });

        // Make harmonized_bill_path nullable if it isn't already
        if (Schema::hasColumn('private_schools', 'harmonized_bill_path')) {
            Schema::table('private_schools', function (Blueprint $table) {
                $table->string('harmonized_bill_path')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        Schema::table('private_schools', function (Blueprint $table) {
            if (!Schema::hasColumn('private_schools', 'tax_clearance_no')) {
                $table->string('tax_clearance_no')->nullable();
            }
            if (Schema::hasColumn('private_schools', 'bill_id')) {
                $table->dropColumn('bill_id');
            }
            if (Schema::hasColumn('private_schools', 'bill_invoice_status')) {
                $table->dropColumn('bill_invoice_status');
            }
            if (Schema::hasColumn('private_schools', 'school_code')) {
                $table->dropColumn('school_code');
            }
        });
    }
};

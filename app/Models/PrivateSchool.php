<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrivateSchool extends Model
{
    protected $fillable = [
        'surname',
        'first_name',
        'middle_name',
        'school',
        'school_code',
        'bill_id',
        'bill_invoice_status',
        'harmonized_bill_path',
        'school_account_number',
        'school_account_name',
        'bank',
        'bank_name',
        'status',
    ];
}

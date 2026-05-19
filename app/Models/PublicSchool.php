<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicSchool extends Model
{
    protected $fillable = [
        'surname',
        'first_name',
        'middle_name',
        'school',
        'school_account_number',
        'school_account_name',
        'bank',
        'bank_name',
        'status',
    ];
}

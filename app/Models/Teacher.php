<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = [
        'surname',
        'first_name',
        'middle_name',
        'school',
        'nin',
        'subjects_taught',
        'appointment_letter_path',
        'account_number',
        'account_name',
        'bank',
        'bank_name',
        'status',
    ];
}

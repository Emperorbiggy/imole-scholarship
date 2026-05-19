<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Awardee extends Model
{
    protected $fillable = [
        'surname',
        'first_name',
        'middle_name',
        'school',
        'nin',
        'account_number',
        'account_name',
        'bank',
        'bank_name',
        'status',
    ];
}

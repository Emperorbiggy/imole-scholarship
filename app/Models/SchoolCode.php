<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolCode extends Model
{
    protected $fillable = [
        'school_name',
        'school_type',
        'code',
        'used',
        'used_at',
    ];

    protected $casts = [
        'used'    => 'boolean',
        'used_at' => 'datetime',
    ];
}

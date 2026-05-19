<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@imoleaward.com'],
            [
                'name'              => 'Imole Admin',
                'email'             => 'admin@imoleaward.com',
                'password'          => Hash::make('Imole@2026#Admin'),
                'email_verified_at' => now(),
            ]
        );
    }
}

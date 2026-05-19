<?php

namespace App\Http\Controllers;

use App\Models\PublicSchool;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicSchoolController extends Controller
{
    public function create()
    {
        return Inertia::render('Registration/PublicSchool');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'surname'               => 'required|string|max:100',
            'first_name'            => 'required|string|max:100',
            'middle_name'           => 'nullable|string|max:100',
            'school'                => 'required|string|max:255',
            'school_account_number' => 'required|string|digits:10',
            'school_account_name'   => 'required|string|max:255',
            'bank'                  => 'required|string|max:20',
            'bank_name'             => 'required|string|max:100',
        ]);

        $acc    = strtolower($validated['school_account_name']);
        $school = strtolower($validated['school']);
        $status = str_contains($acc, $school) || str_contains($school, $acc) ? 'verified' : 'pending';

        PublicSchool::create([
            'surname'               => $validated['surname'],
            'first_name'            => $validated['first_name'],
            'middle_name'           => $validated['middle_name'] ?? null,
            'school'                => $validated['school'],
            'school_account_number' => $validated['school_account_number'],
            'school_account_name'   => $validated['school_account_name'],
            'bank'                  => $validated['bank'],
            'bank_name'             => $validated['bank_name'],
            'status'                => $status,
        ]);

        return redirect()->route('success')->with('type', 'public_school');
    }
}

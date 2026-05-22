<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\SchoolCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function create()
    {
        return Inertia::render('Registration/Teacher');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_code'        => 'required|string|exists:school_codes,code',
            'surname'            => 'required|string|max:100',
            'first_name'         => 'required|string|max:100',
            'middle_name'        => 'nullable|string|max:100',
            'school'             => 'required|string|max:255',
            'designation'        => 'required|string|in:Teacher,Principal',
            'nin'                => 'required|string|digits:11|unique:teachers,nin',
            'subjects_taught'    => 'required|string|max:500',
            'appointment_letter' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'account_number'     => 'required|string|digits:10',
            'account_name'       => 'required|string|max:255',
            'bank'               => 'required|string|max:20',
            'bank_name'          => 'required|string|max:100',
        ]);

        // Resolve the school name from the code (teacher may use used codes)
        $codeRecord = SchoolCode::where('code', $validated['school_code'])->firstOrFail();

        $path = $request->file('appointment_letter')->store('appointment_letters', 'public');

        $acc    = strtolower($validated['account_name']);
        $status = str_contains($acc, strtolower($validated['surname'])) &&
                  str_contains($acc, strtolower($validated['first_name']))
                  ? 'verified' : 'pending';

        Teacher::create([
            'school_code'             => $validated['school_code'],
            'surname'                 => $validated['surname'],
            'first_name'              => $validated['first_name'],
            'middle_name'             => $validated['middle_name'] ?? null,
            'school'                  => $codeRecord->school_name,
            'designation'             => $validated['designation'],
            'nin'                     => $validated['nin'],
            'subjects_taught'         => $validated['subjects_taught'],
            'appointment_letter_path' => $path,
            'account_number'          => $validated['account_number'],
            'account_name'            => $validated['account_name'],
            'bank'                    => $validated['bank'],
            'bank_name'               => $validated['bank_name'],
            'status'                  => $status,
        ]);

        return redirect()->route('success')->with('type', 'teacher');
    }
}

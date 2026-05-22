<?php

namespace App\Http\Controllers;

use App\Models\Awardee;
use App\Models\SchoolCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AwardeeController extends Controller
{
    public function create()
    {
        return Inertia::render('Registration/Awardee');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_code'    => 'required|string|exists:school_codes,code',
            'surname'        => 'required|string|max:100',
            'first_name'     => 'required|string|max:100',
            'middle_name'    => 'nullable|string|max:100',
            'nin'            => 'required|string|digits:11|unique:awardees,nin',
            'account_number' => 'required|string|digits:10',
            'account_name'   => 'required|string|max:255',
            'bank'           => 'required|string|max:20',
            'bank_name'      => 'required|string|max:100',
        ]);

        $codeRecord = SchoolCode::where('code', $validated['school_code'])->firstOrFail();

        $acc    = strtolower($validated['account_name']);
        $status = str_contains($acc, strtolower($validated['surname'])) &&
                  str_contains($acc, strtolower($validated['first_name']))
                  ? 'verified' : 'pending';

        Awardee::create([
            'school_code'    => $validated['school_code'],
            'surname'        => $validated['surname'],
            'first_name'     => $validated['first_name'],
            'middle_name'    => $validated['middle_name'] ?? null,
            'school'         => $codeRecord->school_name,
            'nin'            => $validated['nin'],
            'account_number' => $validated['account_number'],
            'account_name'   => $validated['account_name'],
            'bank'           => $validated['bank'],
            'bank_name'      => $validated['bank_name'],
            'status'         => $status,
        ]);

        return redirect()->route('success')->with('type', 'awardee');
    }
}

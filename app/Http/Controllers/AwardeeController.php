<?php

namespace App\Http\Controllers;

use App\Models\Awardee;
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
            'surname'        => 'required|string|max:100',
            'first_name'     => 'required|string|max:100',
            'middle_name'    => 'nullable|string|max:100',
            'school'         => 'required|string|max:255',
            'nin'            => 'required|string|digits:11|unique:awardees,nin',
            'account_number' => 'required|string|digits:10',
            'account_name'   => 'required|string|max:255',
            'bank'           => 'required|string|max:20',
            'bank_name'      => 'required|string|max:100',
        ]);

        $acc    = strtolower($validated['account_name']);
        $status = str_contains($acc, strtolower($validated['surname'])) &&
                  str_contains($acc, strtolower($validated['first_name']))
                  ? 'verified' : 'pending';

        Awardee::create(array_merge($validated, ['status' => $status]));

        return redirect()->route('success')->with('type', 'awardee');
    }
}

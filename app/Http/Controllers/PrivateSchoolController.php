<?php

namespace App\Http\Controllers;

use App\Models\PrivateSchool;
use App\Models\SchoolCode;
use App\Services\ErmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PrivateSchoolController extends Controller
{
    public function create()
    {
        return Inertia::render('Registration/PrivateSchool');
    }

    public function store(Request $request, ErmsService $erms)
    {
        $validated = $request->validate([
            'school_code'           => 'required|string|exists:school_codes,code',
            'surname'               => 'required|string|max:100',
            'first_name'            => 'required|string|max:100',
            'middle_name'           => 'nullable|string|max:100',
            'school'                => 'required|string|max:255',
            'bill_id'               => 'required|string|max:50',
            'harmonized_bill'       => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'school_account_number' => 'required|string|digits:10',
            'school_account_name'   => 'required|string|max:255',
            'bank'                  => 'required|string|max:20',
            'bank_name'             => 'required|string|max:100',
        ]);

        $codeRecord = SchoolCode::where('code', $validated['school_code'])->lockForUpdate()->first();

        if (!$codeRecord || $codeRecord->used) {
            return back()->withErrors(['school_code' => 'This access code is invalid or has already been used.']);
        }

        if ($codeRecord->school_type !== 'private') {
            return back()->withErrors(['school_code' => 'This code is not valid for private school registration.']);
        }

        // Capture invoice status for admin reference only — registration is always pending
        $billResult    = $erms->findBill($validated['bill_id']);
        $invoiceStatus = 'pending';

        if ($billResult['success'] && !empty($billResult['data']['status'])) {
            $invoiceStatus = $billResult['data']['data']['status'] ?? 'pending';
        }

        $path = $request->hasFile('harmonized_bill')
            ? $request->file('harmonized_bill')->store('harmonized_bills', 'public')
            : null;

        DB::transaction(function () use ($validated, $path, $invoiceStatus, $codeRecord) {
            PrivateSchool::create([
                'surname'               => $validated['surname'],
                'first_name'            => $validated['first_name'],
                'middle_name'           => $validated['middle_name'] ?? null,
                'school'                => $validated['school'],
                'school_code'           => $validated['school_code'],
                'bill_id'               => $validated['bill_id'],
                'bill_invoice_status'   => $invoiceStatus,
                'harmonized_bill_path'  => $path,
                'school_account_number' => $validated['school_account_number'],
                'school_account_name'   => $validated['school_account_name'],
                'bank'                  => $validated['bank'],
                'bank_name'             => $validated['bank_name'],
                'status'                => 'pending',
            ]);

            $codeRecord->update(['used' => true, 'used_at' => now()]);
        });

        return redirect()->route('success')->with('type', 'private_school');
    }
}

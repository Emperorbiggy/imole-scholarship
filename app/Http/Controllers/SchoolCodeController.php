<?php

namespace App\Http\Controllers;

use App\Models\SchoolCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolCodeController extends Controller
{
    public function index()
    {
        $codes = SchoolCode::orderByDesc('created_at')->get();

        return Inertia::render('Admin/SchoolCodes', [
            'codes' => $codes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'school_name' => 'required|string|max:255',
            'school_type' => 'required|in:public,private',
        ]);

        $code = $this->generateUniqueCode();

        SchoolCode::create([
            'school_name' => trim($request->school_name),
            'school_type' => $request->school_type,
            'code'        => $code,
        ]);

        return back()->with('success', "Code {$code} generated for {$request->school_name}.");
    }

    public function destroy(int $id)
    {
        $code = SchoolCode::findOrFail($id);

        if ($code->used) {
            return back()->withErrors(['error' => 'Cannot delete a code that has already been used.']);
        }

        $code->delete();
        return back()->with('success', 'Code deleted.');
    }

    // Public — called via AJAX from school registration forms
    public function verify(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $schoolCode = SchoolCode::where('code', strtoupper(trim($request->code)))->first();

        if (!$schoolCode) {
            return response()->json(['valid' => false, 'message' => 'Invalid access code.'], 422);
        }

        if ($schoolCode->used) {
            return response()->json(['valid' => false, 'message' => 'This code has already been used.'], 422);
        }

        return response()->json([
            'valid'       => true,
            'school_name' => $schoolCode->school_name,
            'school_type' => $schoolCode->school_type,
        ]);
    }

    private function generateUniqueCode(): string
    {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        do {
            $code = '';
            for ($i = 0; $i < 8; $i++) {
                $code .= $chars[random_int(0, strlen($chars) - 1)];
            }
        } while (SchoolCode::where('code', $code)->exists());

        return $code;
    }
}

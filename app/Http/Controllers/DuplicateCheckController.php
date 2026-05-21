<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DuplicateCheckController extends Controller
{
    private const NIN_TABLES = [
        'teacher' => ['table' => 'teachers', 'column' => 'nin'],
        'awardee' => ['table' => 'awardees', 'column' => 'nin'],
    ];

    private const ACCOUNT_TABLES = [
        'teacher'        => ['table' => 'teachers',        'column' => 'account_number'],
        'awardee'        => ['table' => 'awardees',        'column' => 'account_number'],
        'private_school' => ['table' => 'private_schools', 'column' => 'school_account_number'],
        'public_school'  => ['table' => 'public_schools',  'column' => 'school_account_number'],
    ];

    public function checkNin(Request $request)
    {
        $request->validate(['nin' => 'required|string', 'type' => 'required|string']);

        $meta = self::NIN_TABLES[$request->type] ?? null;
        if (!$meta) {
            return response()->json(['duplicate' => false]);
        }

        $exists = DB::table($meta['table'])->where($meta['column'], $request->nin)->exists();
        return response()->json(['duplicate' => $exists]);
    }

    public function checkAccount(Request $request)
    {
        $request->validate(['account_number' => 'required|string', 'type' => 'required|string']);

        $meta = self::ACCOUNT_TABLES[$request->type] ?? null;
        if (!$meta) {
            return response()->json(['duplicate' => false]);
        }

        $exists = DB::table($meta['table'])->where($meta['column'], $request->account_number)->exists();
        return response()->json(['duplicate' => $exists]);
    }
}

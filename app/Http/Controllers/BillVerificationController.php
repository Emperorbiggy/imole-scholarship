<?php

namespace App\Http\Controllers;

use App\Services\ErmsService;
use Illuminate\Http\Request;

class BillVerificationController extends Controller
{
    public function verify(Request $request, ErmsService $erms)
    {
        $request->validate(['bill_id' => 'required|string']);

        $result = $erms->findBill(trim($request->bill_id));

        if (!$result['success']) {
            return response()->json([
                'found'   => false,
                'message' => 'Bill not found. Please check the ID and try again.',
            ], 422);
        }

        $payload = $result['data'];

        // API-level status false means not found
        if (empty($payload['status'])) {
            return response()->json([
                'found'   => false,
                'message' => $payload['message'] ?? 'Bill not found.',
            ], 422);
        }

        $data = $payload['data'] ?? [];

        return response()->json([
            'found'          => true,
            'school_name'    => $data['company']['name'] ?? null,
            'invoice_status' => $data['status'] ?? 'pending',
            'year'           => $data['year'] ?? null,
            'ipn'            => $data['ipn'] ?? null,
        ]);
    }
}

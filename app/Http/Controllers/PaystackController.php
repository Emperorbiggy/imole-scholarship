<?php

namespace App\Http\Controllers;

use App\Services\PaystackService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaystackController extends Controller
{
    public function __construct(private PaystackService $paystack) {}

    public function banks(): JsonResponse
    {
        $result = $this->paystack->listBanks();

        return response()->json($result);
    }

    public function resolve(Request $request): JsonResponse
    {
        $request->validate([
            'account_number' => 'required|string|digits:10',
            'bank_code'      => 'required|string',
        ]);

        $result = $this->paystack->resolveAccount(
            $request->input('account_number'),
            $request->input('bank_code'),
        );

        return response()->json($result);
    }
}

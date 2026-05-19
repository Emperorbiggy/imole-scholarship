<?php

namespace App\Http\Controllers;

use App\Services\NINService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NINVerificationController extends Controller
{
    public function __construct(private NINService $ninService) {}

    public function verify(Request $request): JsonResponse
    {
        $request->validate(['nin' => 'required|string|digits:11']);

        $nin = $request->input('nin');

        try {
            $result = $this->ninService->verifyNIN($nin);
            $member = $this->ninService->extractMemberData($result, $nin);

            // Prembly returns status: true (boolean) in both test and live modes
            $status = $result['status'] ?? null;

            if ($status === true && $member['nin']) {
                return response()->json([
                    'verified'    => true,
                    'first_name'  => $member['first_name'],
                    'middle_name' => $member['middle_name'],
                    'surname'     => $member['surname'],
                ]);
            }

            return response()->json([
                'verified' => false,
                'message'  => 'NIN could not be verified. Please check and try again.',
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'verified' => false,
                'message'  => 'Verification service unavailable. You may proceed.',
            ], 503);
        }
    }
}

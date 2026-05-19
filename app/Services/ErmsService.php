<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ErmsService
{
    private string $baseUrl;
    private string $appKey;

    public function __construct()
    {
        $this->baseUrl = config('services.erms.base_url');
        $this->appKey  = config('services.erms.app_key');
    }

    /**
     * Find / verify a bill by bill ID.
     *
     * curl --location 'https://erms.cloudware.ng/api/gateway/v1/bills/find?bill_id=3103141117'
     * --header 'Accept: application/json'
     * --header 'x-app-key: •••'
     *
     * @param  string $billId
     * @return array
     */
    public function findBill(string $billId): array
    {
        $url = "{$this->baseUrl}/bills/find";

        Log::info('ERMS: Find Bill Request', [
            'bill_id'   => $billId,
            'url'       => $url,
            'timestamp' => now()->toISOString(),
        ]);

        try {
            $response = Http::withHeaders([
                'Accept'    => 'application/json',
                'x-app-key' => $this->appKey,
            ])->get($url, ['bill_id' => $billId]);

            $data = $response->json();

            Log::info('ERMS: Find Bill Response', [
                'bill_id'     => $billId,
                'status_code' => $response->status(),
                'success'     => $response->successful(),
                'response'    => $data,
                'timestamp'   => now()->toISOString(),
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data'    => $data,
                ];
            }

            Log::error('ERMS: Find Bill Failed', [
                'bill_id'     => $billId,
                'status_code' => $response->status(),
                'response'    => $data,
            ]);

            return [
                'success' => false,
                'message' => $data['message'] ?? 'Bill verification failed',
                'data'    => $data,
            ];
        } catch (\Exception $e) {
            Log::error('ERMS: Find Bill Exception', [
                'bill_id' => $billId,
                'error'   => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Service unavailable: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Verify a Tax Clearance Certificate (TCC).
     *
     * curl --location 'https://erms.cloudware.ng/api/gateway/v1/tccs/verify'
     * --header 'Accept: application/json'
     * --header 'x-app-key: •••'
     * --data '{ "certificate_no": "724319544276/2023" }'
     *
     * @param  string $certificateNo
     * @return array
     */
    public function verifyTCC(string $certificateNo): array
    {
        $url = "{$this->baseUrl}/tccs/verify";

        Log::info('ERMS: Verify TCC Request', [
            'certificate_no' => $certificateNo,
            'url'            => $url,
            'timestamp'      => now()->toISOString(),
        ]);

        try {
            $response = Http::withHeaders([
                'Accept'    => 'application/json',
                'x-app-key' => $this->appKey,
            ])->post($url, ['certificate_no' => $certificateNo]);

            $data = $response->json();

            Log::info('ERMS: Verify TCC Response', [
                'certificate_no' => $certificateNo,
                'status_code'    => $response->status(),
                'success'        => $response->successful(),
                'response'       => $data,
                'timestamp'      => now()->toISOString(),
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data'    => $data,
                    'valid'   => $data['valid'] ?? $data['status'] ?? false,
                ];
            }

            Log::error('ERMS: Verify TCC Failed', [
                'certificate_no' => $certificateNo,
                'status_code'    => $response->status(),
                'response'       => $data,
            ]);

            return [
                'success' => false,
                'message' => $data['message'] ?? 'TCC verification failed',
                'data'    => $data,
            ];
        } catch (\Exception $e) {
            Log::error('ERMS: Verify TCC Exception', [
                'certificate_no' => $certificateNo,
                'error'          => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Service unavailable: ' . $e->getMessage(),
            ];
        }
    }
}

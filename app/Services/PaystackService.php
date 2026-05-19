<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackService
{
    private string $baseUrl;
    private string $secretKey;

    public function __construct()
    {
        $this->baseUrl   = config('services.paystack.base_url', 'https://api.paystack.co');
        $this->secretKey = config('services.paystack.secret_key');
    }

    private function headers(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->secretKey,
            'Content-Type'  => 'application/json',
        ];
    }

    /**
     * Get list of banks from Paystack.
     *
     * @param  string $country
     * @param  int    $perPage
     * @return array
     */
    public function listBanks(string $country = 'nigeria', int $perPage = 100): array
    {
        $startTime = microtime(true);
        $url       = "{$this->baseUrl}/bank";

        Log::info('Paystack: List Banks Request Started', [
            'country'   => $country,
            'perPage'   => $perPage,
            'timestamp' => now()->toISOString(),
        ]);

        try {
            $response = Http::withHeaders($this->headers())->get($url, [
                'country' => $country,
                'perPage' => $perPage,
            ]);

            $responseTime = round((microtime(true) - $startTime) * 1000, 2);
            $data         = $response->json();

            Log::info('Paystack: List Banks Response', [
                'status_code'      => $response->status(),
                'response_time_ms' => $responseTime,
                'banks_count'      => isset($data['data']) ? count($data['data']) : 0,
                'success'          => $response->successful(),
                'timestamp'        => now()->toISOString(),
            ]);

            if (app()->environment('local')) {
                Log::debug('Paystack RAW Response (Banks)', ['parsed_json' => $data]);
            }

            if ($response->successful() && isset($data['status']) && $data['status'] === true) {
                return [
                    'success' => true,
                    'data'    => $data['data'] ?? [],
                ];
            }

            Log::error('Paystack: List Banks Failed', [
                'message'     => $data['message'] ?? 'API request failed',
                'status_code' => $response->status(),
            ]);

            return [
                'success' => false,
                'message' => $data['message'] ?? 'Failed to fetch banks',
                'data'    => [],
            ];
        } catch (\Exception $e) {
            Log::error('Paystack: List Banks Exception', ['error' => $e->getMessage()]);

            return [
                'success' => false,
                'message' => 'Service unavailable: ' . $e->getMessage(),
                'data'    => [],
            ];
        }
    }

    /**
     * Resolve an account number to get the account name.
     *
     * @param  string $accountNumber
     * @param  string $bankCode
     * @return array
     */
    public function resolveAccount(string $accountNumber, string $bankCode): array
    {
        $startTime = microtime(true);
        $url       = "{$this->baseUrl}/bank/resolve";

        Log::info('Paystack: Resolve Account Request Started', [
            'account_number' => $accountNumber,
            'bank_code'      => $bankCode,
            'timestamp'      => now()->toISOString(),
        ]);

        try {
            $response = Http::withHeaders($this->headers())->get($url, [
                'account_number' => $accountNumber,
                'bank_code'      => $bankCode,
            ]);

            $responseTime = round((microtime(true) - $startTime) * 1000, 2);
            $data         = $response->json();

            Log::info('Paystack: Resolve Account Response', [
                'status_code'      => $response->status(),
                'response_time_ms' => $responseTime,
                'success'          => $response->successful(),
                'timestamp'        => now()->toISOString(),
            ]);

            if ($response->successful() && isset($data['status']) && $data['status'] === true) {
                return [
                    'success'      => true,
                    'account_name' => $data['data']['account_name'] ?? null,
                    'account_number' => $data['data']['account_number'] ?? $accountNumber,
                    'bank_id'      => $data['data']['bank_id'] ?? null,
                    'data'         => $data['data'] ?? [],
                ];
            }

            Log::error('Paystack: Resolve Account Failed', [
                'account_number' => $accountNumber,
                'bank_code'      => $bankCode,
                'message'        => $data['message'] ?? 'Resolve failed',
                'status_code'    => $response->status(),
            ]);

            return [
                'success' => false,
                'message' => $data['message'] ?? 'Could not resolve account',
            ];
        } catch (\Exception $e) {
            Log::error('Paystack: Resolve Account Exception', [
                'account_number' => $accountNumber,
                'bank_code'      => $bankCode,
                'error'          => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Service unavailable: ' . $e->getMessage(),
            ];
        }
    }
}

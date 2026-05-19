<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NINService
{
    private string $baseUrl;
    private string $apiKey;
    private string $environment;

    public function __construct()
    {
        $this->baseUrl     = config('services.prembly.base_url', 'https://api.prembly.com');
        $this->apiKey      = config('services.prembly.api_key', '');
        $this->environment = config('services.prembly.env', 'test');
    }

    private function headers(): array
    {
        return [
            'accept'       => 'application/json',
            'content-type' => 'application/json',
            'x-api-key'    => $this->apiKey,
        ];
    }

    /**
     * Verify NIN using Prembly API.
     *
     * @param  string $nin
     * @return array
     * @throws \Exception
     */
    public function verifyNIN(string $nin): array
    {
        $url     = "{$this->baseUrl}/verification/vnin-basic";
        $headers = $this->headers();
        $body    = ['number' => $nin];

        Log::info('NIN: Verify Request', [
            'url'       => $url,
            'headers'   => $headers,
            'body'      => $body,
            'timestamp' => now()->toISOString(),
        ]);

        try {
            $response = Http::withHeaders($headers)->post($url, $body);

            Log::info('NIN: Raw Response', [
                'nin'         => $nin,
                'status_code' => $response->status(),
                'headers'     => $response->headers(),
                'body'        => $response->body(),
            ]);

            if (!$response->successful()) {
                Log::error('NIN: Verification Failed', [
                    'nin'         => $nin,
                    'status_code' => $response->status(),
                    'body'        => $response->body(),
                ]);

                throw new \Exception('NIN verification failed: ' . $response->status());
            }

            $data = $response->json();

            Log::info('NIN: Verification Successful', [
                'nin'       => $nin,
                'response'  => $data,
                'timestamp' => now()->toISOString(),
            ]);

            return $data;
        } catch (\Exception $e) {
            Log::error('NIN: Verification Exception', [
                'nin'   => $nin,
                'error' => $e->getMessage(),
            ]);

            throw new \Exception('NIN verification error: ' . $e->getMessage());
        }
    }

    /**
     * Check if a NIN is valid.
     *
     * @param  string $nin
     * @return bool
     */
    public function isNINValid(string $nin): bool
    {
        try {
            $result = $this->verifyNIN($nin);
            return isset($result['status']) && $result['status'] === 'success';
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Extract member data from a Prembly verification response.
     *
     * @param  array  $verificationData
     * @param  string $originalNin
     * @return array
     */
    public function extractMemberData(array $verificationData, string $originalNin): array
    {
        if (!isset($verificationData['data'])) {
            return [
                'nin'                => null,
                'first_name'         => null,
                'last_name'          => null,
                'gender'             => null,
                'date_of_birth'      => null,
                'phone_number'       => null,
                'email'              => null,
                'residential_address'=> null,
            ];
        }

        $data = $verificationData['data'];

        // In test mode keep the original NIN; in live use the verified NIN from response
        $ninToUse = ($this->environment === 'test')
            ? $originalNin
            : ($data['nin'] ?? null);

        return [
            'nin'                  => $ninToUse,
            'first_name'           => $data['firstname'] ?? null,
            'middle_name'          => $data['middlename'] ?? null,
            'surname'              => $data['surname'] ?? null,
            'gender'               => $data['gender'] ?? null,
            'date_of_birth'        => $this->formatDate($data['birthdate'] ?? null),
            'phone_number'         => $data['telephoneno'] ?? null,
            'email'                => null,
            'residential_address'  => $data['residence_address'] ?? null,
            'photo'                => $data['photo'] ?? null,
            // Verification metadata
            'verification_status'    => $verificationData['verification']['status'] ?? null,
            'verification_reference' => $verificationData['verification']['reference'] ?? null,
            'verification_id'        => $verificationData['verification']['verification_id'] ?? null,
        ];
    }

    /**
     * Validate NIN format (10–11 digits).
     *
     * @param  string $nin
     * @return bool
     */
    public function validateNINFormat(string $nin): bool
    {
        return (bool) preg_match('/^\d{10,11}$/', trim($nin));
    }

    /**
     * Strip non-digit characters and validate NIN.
     *
     * @param  string $nin
     * @return string|null
     */
    public function cleanNIN(string $nin): ?string
    {
        $cleaned = preg_replace('/[^0-9]/', '', $nin);
        return $this->validateNINFormat($cleaned) ? $cleaned : null;
    }

    /**
     * Download a photo (URL or base64) and store it in public storage.
     *
     * @param  string $photoUrl
     * @param  string $nin
     * @return string|null  Public URL of stored photo, or null on failure
     */
    public function downloadAndStorePhoto(string $photoUrl, string $nin): ?string
    {
        if (empty($photoUrl)) {
            return null;
        }

        try {
            // Base64 JPEG data starts with /9j/
            if (str_starts_with($photoUrl, '/9j/')) {
                $imageContent = base64_decode($photoUrl);
                if ($imageContent === false) {
                    Log::error('NIN: Failed to decode base64 photo', ['nin' => $nin]);
                    return null;
                }
            } else {
                $imageContent = @file_get_contents($photoUrl);
                if ($imageContent === false) {
                    Log::error('NIN: Failed to download photo from URL', ['url' => $photoUrl, 'nin' => $nin]);
                    return null;
                }
            }

            $filename = 'nin_' . $nin . '_' . Str::random(8) . '.jpg';
            $path     = 'images/' . $filename;

            if (!Storage::disk('public')->put($path, $imageContent)) {
                Log::error('NIN: Failed to store photo', ['path' => $path, 'nin' => $nin]);
                return null;
            }

            $publicUrl = asset('storage/' . $path);
            Log::info('NIN: Photo stored successfully', ['nin' => $nin, 'url' => $publicUrl]);

            return $publicUrl;
        } catch (\Exception $e) {
            Log::error('NIN: Error downloading photo', [
                'nin'       => $nin,
                'photo_url' => $photoUrl,
                'error'     => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Batch verify NINs with a small delay between requests to respect rate limits.
     *
     * @param  array $nins
     * @return array
     */
    public function batchVerifyNINs(array $nins): array
    {
        $results = [
            'total'    => count($nins),
            'verified' => 0,
            'failed'   => 0,
            'data'     => [],
            'errors'   => [],
        ];

        foreach ($nins as $nin) {
            try {
                $verificationData = $this->verifyNIN($nin);
                $memberData       = $this->extractMemberData($verificationData, $nin);

                if ($memberData['nin']) {
                    $results['verified']++;
                    $results['data'][$nin] = $memberData;
                } else {
                    $results['failed']++;
                    $results['errors'][$nin] = 'Invalid verification response';
                }

                usleep(100_000); // 100ms between requests
            } catch (\Exception $e) {
                $results['failed']++;
                $results['errors'][$nin] = $e->getMessage();

                Log::error("NIN: Batch verification failed for {$nin}", ['error' => $e->getMessage()]);
            }
        }

        return $results;
    }

    /**
     * Convert date from DD-MM-YYYY (API format) to YYYY-MM-DD (database format).
     *
     * @param  string|null $dateString
     * @return string|null
     */
    private function formatDate(?string $dateString): ?string
    {
        if (!$dateString) {
            return null;
        }

        $parts = explode('-', $dateString);
        if (count($parts) === 3) {
            return "{$parts[2]}-{$parts[1]}-{$parts[0]}";
        }

        return $dateString;
    }
}

<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class CloudinaryService
{
    public static function upload($file)
    {
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        if (!$cloudName || !$apiKey || !$apiSecret) {
            Log::error('Cloudinary credentials missing');
            return null;
        }

        $timestamp = time();
        $signature = sha1("timestamp=$timestamp" . $apiSecret);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api.cloudinary.com/v1_1/$cloudName/image/upload");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, [
            'file' => new \CURLFile($file->getPathname()),
            'timestamp' => $timestamp,
            'api_key' => $apiKey,
            'signature' => $signature,
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        $response = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            Log::error('Cloudinary Curl Error: ' . $error);
            return null;
        }

        $data = json_decode($response, true);
        
        if (isset($data['error'])) {
            Log::error('Cloudinary API Error: ' . ($data['error']['message'] ?? 'Unknown error'));
            return null;
        }

        return $data['secure_url'] ?? null;
    }
}

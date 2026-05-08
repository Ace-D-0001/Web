<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
            'image' => 'nullable|image|max:5120', // New image file upload
            'gallery' => 'nullable|array',
            'specs' => 'nullable|array',
            'is_paused' => 'boolean'
        ]);

        if ($request->hasFile('image')) {
            $validated['image_url'] = $this->uploadToCloudinary($request->file('image'));
        }

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    private function uploadToCloudinary($file)
    {
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

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
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        return $data['secure_url'] ?? null;
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'string|max:255',
            'price' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'gallery' => 'nullable|array',
            'specs' => 'nullable|array',
            'is_paused' => 'boolean'
        ]);

        if ($request->hasFile('image')) {
            $validated['image_url'] = $this->uploadToCloudinary($request->file('image'));
        }

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy($id)
    {
        Product::findOrFail($id)->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function togglePause($id)
    {
        $product = Product::findOrFail($id);
        $product->update(['is_paused' => !$product->is_paused]);
        return response()->json($product);
    }
}

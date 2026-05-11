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
        // Handle JSON strings from FormData
        if (is_string($request->gallery)) {
            $request->merge(['gallery' => json_decode($request->gallery, true)]);
        }
        if (is_string($request->specs)) {
            $request->merge(['specs' => json_decode($request->specs, true)]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'gallery' => 'nullable|array',
            'specs' => 'nullable|array',
            'is_paused' => 'boolean'
        ]);

        if ($request->hasFile('image')) {
            $url = \App\Services\CloudinaryService::upload($request->file('image'));
            if ($url) $validated['image_url'] = $url;
        }

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        // Handle JSON strings from FormData
        if ($request->has('gallery') && is_string($request->gallery)) {
            $request->merge(['gallery' => json_decode($request->gallery, true)]);
        }
        if ($request->has('specs') && is_string($request->specs)) {
            $request->merge(['specs' => json_decode($request->specs, true)]);
        }

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
            $url = \App\Services\CloudinaryService::upload($request->file('image'));
            if ($url) $validated['image_url'] = $url;
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

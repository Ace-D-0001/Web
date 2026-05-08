<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function index()
    {
        return response()->json(TeamMember::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'position' => 'required|string',
            'email' => 'nullable|email',
            'image_url' => 'nullable|string',
            'image' => 'nullable|image|max:5120'
        ]);

        if ($request->hasFile('image')) {
            $validated['image_url'] = $this->uploadToCloudinary($request->file('image'));
        }

        $member = TeamMember::create($validated);
        return response()->json($member);
    }

    public function update(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string',
            'position' => 'string',
            'email' => 'nullable|email',
            'image_url' => 'nullable|string',
            'image' => 'nullable|image|max:5120'
        ]);

        if ($request->hasFile('image')) {
            $validated['image_url'] = $this->uploadToCloudinary($request->file('image'));
        }

        $member->update($validated);
        return response()->json($member);
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

    public function destroy($id)
    {
        TeamMember::destroy($id);
        return response()->json(['message' => 'Member deleted']);
    }
}

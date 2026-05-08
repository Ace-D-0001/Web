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
            $url = \App\Services\CloudinaryService::upload($request->file('image'));
            if ($url) $validated['image_url'] = $url;
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
            $url = \App\Services\CloudinaryService::upload($request->file('image'));
            if ($url) $validated['image_url'] = $url;
        }

        $member->update($validated);
        return response()->json($member);
    }

    public function destroy($id)
    {
        TeamMember::destroy($id);
        return response()->json(['message' => 'Member deleted']);
    }
}

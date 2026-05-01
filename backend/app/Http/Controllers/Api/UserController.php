<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete an admin user.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate(['role' => 'required|in:user,admin']);
        
        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);
        
        return response()->json(['message' => 'User role updated successfully.']);
    }
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:active,pending,rejected']);
        
        $user = User::findOrFail($id);
        $user->update(['status' => $request->status]);
        
        return response()->json(['message' => 'User status updated successfully.']);
    }
}

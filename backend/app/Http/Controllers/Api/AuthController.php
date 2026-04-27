<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Mail\VerifyEmailMail;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email'
        ]);

        $token = Str::random(60);

        $user = User::create([
            'email' => $request->email,
            'role' => 'user',
            'status' => 'pending',
            'verification_token' => $token
        ]);

        // Generate frontend link
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $link = rtrim($frontendUrl, '/') . '/set-password/' . $token;

        Mail::to($user->email)->send(new VerifyEmailMail($link));

        return response()->json(['message' => 'Verification email sent. Please check your inbox.']);
    }

    public function setPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::where('verification_token', $request->token)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired token.'], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'status' => 'active',
            'verification_token' => null,
            'email_verified_at' => now(),
        ]);

        return response()->json(['message' => 'Password set successfully. You can now login.']);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'Your account is pending. Please check your email to set your password.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Logged in successfully',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin access only.'], 403);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'Your account is pending.'], 403);
        }

        $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'message' => 'Admin logged in successfully',
            'user' => $user,
            'token' => $token
        ]);
    }
}

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

use App\Mail\OTPMail;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'status' => 'pending',
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Account created successfully. Please wait for admin approval.',
            'user' => $user
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'type' => 'required|string|in:verification,reset'
        ]);

        $user = User::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('otp_expires_at', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired code.'], 400);
        }

        if ($request->type === 'verification') {
            $user->update([
                'status' => 'active',
                'otp' => null,
                'otp_expires_at' => null,
                'email_verified_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Code verified successfully.', 'email' => $user->email]);
    }

    public function setPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'status' => 'active',
        ]);

        return response()->json(['message' => 'Password set successfully. You can now login.']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($user->email)->send(new OTPMail($otp, 'reset'));

        return response()->json(['message' => 'Password reset code sent to your email.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('otp_expires_at', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired code.'], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'otp' => null,
            'otp_expires_at' => null,
        ]);

        return response()->json(['message' => 'Password reset successfully.']);
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

        if ($user->status === 'pending') {
            return response()->json(['message' => 'Your account is pending admin approval.'], 403);
        } elseif ($user->status === 'rejected') {
            return response()->json(['message' => 'Your account has been rejected by the admin.'], 403);
        } elseif ($user->status !== 'active') {
            return response()->json(['message' => 'Your account does not have access.'], 403);
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

        $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'message' => 'Admin logged in successfully',
            'user' => $user,
            'token' => $token
        ]);
    }

    // Google Authentication
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => Hash::make(Str::random(24)),
                    'status' => 'pending',
                    'role' => 'user',
                    'email_verified_at' => now(),
                ]);
            } else {
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);
            }

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

            if ($user->status === 'pending') {
                return redirect()->away($frontendUrl . '/login?error=' . urlencode('Your account is pending admin approval.'));
            } elseif ($user->status === 'rejected') {
                return redirect()->away($frontendUrl . '/login?error=' . urlencode('Your account has been rejected by the admin.'));
            } elseif ($user->status !== 'active') {
                return redirect()->away($frontendUrl . '/login?error=' . urlencode('Your account does not have access.'));
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect to frontend with token
            return redirect()->away($frontendUrl . '/login?token=' . $token);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Google login failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}

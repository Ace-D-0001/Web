<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\DB;

Route::get('/status', function () {
    try {
        DB::connection()->getPdo();
        $db = true;
    } catch (\Exception $e) {
        $db = false;
    }
    
    return response()->json([
        'status' => 'online',
        'database' => $db,
        'version' => '1.0.0'
    ]);
});

use App\Http\Controllers\Api\AuthController;

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/set-password', [AuthController::class, 'setPassword']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// Google Auth
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\SiteSettingController;

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // User Management
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::post('/users/{id}/status', [UserController::class, 'updateStatus']);

    // Card Management (Products)
    Route::apiResource('/products', ProductController::class);
    Route::post('/products/{id}/toggle-pause', [ProductController::class, 'togglePause']);

    // Inquiries (Messages)
    Route::get('/inquiries', [InquiryController::class, 'index']);
    Route::delete('/inquiries/{id}', [InquiryController::class, 'destroy']);

    // Site Settings (Navbar/Footer)
    Route::get('/settings', [SiteSettingController::class, 'all']);
    Route::post('/settings/{key}', [SiteSettingController::class, 'set']);
});

// Public routes for inquiries and product viewing
Route::get('/products', [ProductController::class, 'index']);
Route::post('/inquiries', [InquiryController::class, 'store']);
Route::get('/settings/{key}', [SiteSettingController::class, 'get']);

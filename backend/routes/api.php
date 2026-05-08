<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\UserOrderController;
use App\Http\Controllers\Api\NotificationController;

/* --- Status Route --- */
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

/* --- Auth Routes --- */
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

/* --- Authenticated Routes --- */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // User Orders
    Route::get('/orders', [UserOrderController::class, 'index']);
    Route::post('/orders', [UserOrderController::class, 'store']);
    Route::get('/orders/{id}', [UserOrderController::class, 'show']);
    Route::post('/orders/{id}/confirm', [UserOrderController::class, 'confirm']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
});

/* --- Admin Routes --- */
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // User Management
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::post('/users/{id}/status', [UserController::class, 'updateStatus']);

    // Card Management (Products)
    Route::apiResource('/products', ProductController::class);
    Route::post('/products/{id}/toggle-pause', [ProductController::class, 'togglePause']);

    // Team Management
    Route::apiResource('/team', TeamMemberController::class);

    // Inquiries (Messages)
    Route::get('/inquiries', [InquiryController::class, 'index']);
    Route::delete('/inquiries/{id}', [InquiryController::class, 'destroy']);

    // Site Settings (Navbar/Footer)
    Route::get('/settings', [SiteSettingController::class, 'all']);
    Route::post('/settings/{key}', [SiteSettingController::class, 'set']);

    // Admin Orders
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::post('/orders', [AdminOrderController::class, 'store']);
    Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
    Route::put('/orders/{id}', [AdminOrderController::class, 'update']);
    Route::post('/orders/{id}/assign', [AdminOrderController::class, 'assign']);
    Route::post('/orders/{id}/complete', [AdminOrderController::class, 'complete']);
    Route::post('/orders/{id}/cancel', [AdminOrderController::class, 'cancel']);
});

/* --- Public Content Routes --- */
Route::get('/products', [ProductController::class, 'index']);
Route::get('/team', [TeamMemberController::class, 'index']);
Route::post('/inquiries', [InquiryController::class, 'store']);
Route::get('/settings/{key}', [SiteSettingController::class, 'get']);

/* --- Secret Seeder Route (Temporary) --- */
Route::get('/run-seeder', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
        return response()->json(['message' => 'Database updated successfully!', 'output' => \Illuminate\Support\Facades\Artisan::output()]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

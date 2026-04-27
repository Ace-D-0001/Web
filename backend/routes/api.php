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
Route::post('/set-password', [AuthController::class, 'setPassword']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

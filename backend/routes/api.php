<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\SteamAuthController;

Route::get('/auth/steam', [SteamAuthController::class, 'redirect']);
Route::get('/auth/steam/callback', [SteamAuthController::class, 'callback']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
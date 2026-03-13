<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SteamAuthController;

Route::get('/auth/steam', [SteamAuthController::class, 'redirect']);
Route::get('/auth/steam/callback', [SteamAuthController::class, 'callback']);
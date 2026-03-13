<?php

namespace App\Http\Controllers;

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

class SteamAuthController extends Controller
{
    // Redirect user to Steam login page
    public function redirect()
    {
        return Socialite::driver('steam')->redirect();
    }

    // Steam redirects back here after login
    public function callback()
    {
        try {
            $steamUser = Socialite::driver('steam')->user();
        } catch (\Exception $e) {
            return redirect(env('FRONTEND_URL') . '/login?error=failed');
        }

        $user = User::updateOrCreate(
            ['steam_id' => $steamUser->getId()],
            [
                'name'   => $steamUser->getNickname(),
                'avatar' => $steamUser->getAvatar(),
            ]
        );

        $token = $user->createToken('steam')->plainTextToken;

        return redirect(env('FRONTEND_URL') . '/auth/callback?token=' . $token);
    }
}
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirect(string $provider): RedirectResponse
    {
        if (!in_array($provider, ['google', 'facebook'], true)) {
            return redirect('/login?error=unsupported_provider');
        }

        $clientId = config("services.{$provider}.client_id");
        $clientSecret = config("services.{$provider}.client_secret");
        $redirect = config("services.{$provider}.redirect");

        if (!$clientId || !$clientSecret || !$redirect) {
            return redirect('/login?error=oauth_not_configured');
        }

        try {
            return Socialite::driver($provider)
                ->stateless()
                ->redirect();
        } catch (\Throwable $e) {
            Log::error('OAuth redirect failed', [
                'provider' => $provider,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return redirect('/login?error=oauth_redirect_failed');
        }
    }

    public function callback(string $provider): RedirectResponse
    {
        if (!in_array($provider, ['google', 'facebook'], true)) {
            return redirect('/login?error=unsupported_provider');
        }

        try {
            $socialUser = Socialite::driver($provider)
                ->stateless()
                ->user();
        } catch (\Throwable $e) {
            Log::error('OAuth callback failed', [
                'provider' => $provider,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return redirect('/login?error=oauth_failed');
        }

        if (!$socialUser || !$socialUser->getEmail()) {
            return redirect('/login?error=no_email');
        }

        $user = User::where('email', $socialUser->getEmail())->first();

        if ($user && $user->status === User::STATUS_INACTIVE) {
            return redirect('/login?error=deactivated');
        }

        if (!$user) {
            $user = User::create([
                'name' => $socialUser->getName()
                    ?: $socialUser->getNickname()
                    ?: 'Social User',
                'email' => $socialUser->getEmail(),
                'password' => Hash::make(Str::random(24)),
                'email_verified_at' => now(),
            ]);

            $buyerRole = Role::where('slug', 'buyer')->first();

            if ($buyerRole) {
                $user->roles()->attach($buyerRole->id);
            }
        }

        $token = $user->createToken('social-token')->plainTextToken;

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->pluck('slug')->toArray(),
            'email_verified_at' => $user->email_verified_at,
        ];

        $frontendUrl = rtrim(
            env('FRONTEND_URL', 'http://localhost:3000'),
            '/'
        );

        return redirect()->to(
            $frontendUrl
            . '/oauth/callback?token='
            . urlencode($token)
            . '&user='
            . urlencode(json_encode($userData))
        );
    }
}
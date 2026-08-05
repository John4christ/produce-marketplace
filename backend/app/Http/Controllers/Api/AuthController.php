<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\EmailVerificationRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResendVerificationRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $role = Role::where('slug', $validated['role'])->firstOrFail();
        $user->roles()->attach($role->id);

        $user->notify(new VerifyEmailNotification());

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully. Please verify your email.',
            'data' => [
                'user' => new UserResource($user->load('roles')),
                'token' => $token,
            ],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user->tokens()->delete();

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => new UserResource($user->load('roles')),
                'token' => $token,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($request->user()->load('roles')),
        ]);
    }

    public function verifyEmail(EmailVerificationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::findOrFail($validated['id']);

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified.',
            ]);
        }

        if (!URL::hasValidSignature($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired verification link.',
            ], 403);
        }

        $user->markEmailAsVerified();

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.',
        ]);
    }

    public function resendVerification(ResendVerificationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->firstOrFail();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email is already verified.',
            ], 422);
        }

        $user->notify(new VerifyEmailNotification());

        return response()->json([
            'success' => true,
            'message' => 'Verification email sent.',
        ]);
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if ($user) {
            $token = app('auth.password.broker')->createToken($user);

            $user->notify(new ResetPasswordNotification($token));
        }

        return response()->json([
            'success' => true,
            'message' => 'If an account exists with this email, a password reset link has been sent.',
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $status = Password::reset(
            [
                'email' => $validated['email'],
                'password' => $validated['password'],
                'password_confirmation' => $validated['password_confirmation'],
                'token' => $validated['token'],
            ],
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'success' => false,
                'message' => 'Unable to reset password. The token may be invalid or expired.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully.',
        ]);
    }
}

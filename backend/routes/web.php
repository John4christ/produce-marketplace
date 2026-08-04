<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\SocialiteController;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('web')->group(function () {
    Route::get('/auth/{provider}/redirect', [SocialiteController::class, 'redirect'])
        ->where('provider', 'google|facebook')
        ->name('socialite.redirect');

    Route::get('/auth/{provider}/callback', [SocialiteController::class, 'callback'])
        ->where('provider', 'google|facebook')
        ->name('socialite.callback');
});

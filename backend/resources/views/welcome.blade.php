<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'AgriHarvest') }}</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @else
            <style>
                body {
                    font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                    background-color: #f0fdf4;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                }
                .logo {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #2d8a4e;
                    margin-bottom: 1rem;
                }
                .tagline {
                    color: #6b7280;
                    font-size: 1.125rem;
                    margin-bottom: 2rem;
                }
                .btn {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    background-color: #2d8a4e;
                    color: white;
                    text-decoration: none;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    margin: 0 0.5rem;
                }
                .btn:hover {
                    background-color: #1a6b38;
                }
            </style>
        @endif
    </head>
    <body>
        <div class="container">
            <div class="logo">🌾 AgriHarvest</div>
            <p class="tagline">Fresh Local Produce Picked at Dawn.</p>
            @if (Route::has('login'))
                <div>
                    @auth
                        <a href="{{ url('/dashboard') }}" class="btn">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="btn">Log in</a>
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="btn" style="background-color: #f59e0b;">Register</a>
                        @endif
                    @endauth
                </div>
            @endif
        </div>
    </body>
</html>

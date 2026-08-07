# AgriHarvest

AgriHarvest is a full-stack agricultural marketplace that connects farmers and buyers.

## Features

- User registration and login
- Password reset via email
- Farmer dashboard
- Buyer dashboard
- Admin dashboard
- Product management
- Product approval workflow
- Profile management
- Google authentication

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Laravel 12
- MySQL
- Sanctum Authentication

## Installation

### Backend

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend

```bash
npm install
npm run dev
```

## Author

ADEDIRAN JOHN
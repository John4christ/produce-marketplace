# Produce Marketplace Laravel API Development

**Session ID:** ses_04cc3ec91ffeDnNHQevVhHYwCS
**Created:** 7/30/2026, 2:34:46 PM
**Updated:** 7/30/2026, 3:45:54 PM

---

## User

You are a Senior Laravel Backend Engineer, Database Architect, and Cybersecurity Expert.

Your task is to build a production-ready backend API for a modern Produce Marketplace application.

Technology Stack

- Laravel 12
- PHP 8.3+
- MySQL
- Laravel Sanctum for API authentication
- Eloquent ORM
- Laravel Validation
- Laravel API Resources
- Laravel Form Requests
- Laravel Queues
- Laravel Storage
- REST API

Architecture

Use Laravel best practices.

Follow MVC architecture.

Use:

- Models
- Controllers
- Migrations
- Seeders
- Factories
- Form Requests
- API Resources
- Policies
- Middleware
- Services (when necessary)

Project Features

Roles

- Admin
- Farmer
- Buyer

Modules

- Authentication
- Products
- Categories
- Cart
- Orders
- Payments
- Reviews
- Notifications
- User Profiles
- Dashboard

Security

Implement:

- Laravel Sanctum authentication
- Password hashing
- Authorization Policies
- Role-based middleware
- Validation on every request
- SQL Injection prevention
- XSS prevention
- CSRF protection where applicable
- Rate limiting
- Secure file upload validation
- Secure API responses
- Proper error handling

Database

Design a normalized MySQL database.

Use foreign keys.

Use indexes where necessary.

Use timestamps.

Coding Standards

- Production-ready code
- Clean code
- Comment difficult sections
- Follow Laravel conventions
- No placeholder code

Output

Generate one module at a time.

For every module include:

1. Migration
2. Model
3. Controller
4. Form Request
5. API Resource
6. Routes
7. Seeder
8. Factory
9. Explanation

Wait for my approval before generating the next module.

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: bash**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

---

## Assistant

## Module 1: Authentication & User Management

I have generated the complete Authentication module with role-based access control (Admin, Farmer, Buyer) and Sanctum API authentication.

### Files Generated

**Models**
- `app/Models/User.php` — Uses `HasApiTokens`, defines many-to-many `roles()` relationship and `hasRole()` helper
- `app/Models/Role.php` — Role model with `users()` relationship

**Migrations**
- `database/migrations/2026_07_30_000001_create_roles_table.php` — `roles` table with `name`, `slug`, `description`
- `database/migrations/2026_07_30_000002_create_role_user_table.php` — Pivot table with unique constraint on `user_id + role_id` and indexes

**Controllers**
- `app/Http/Controllers/Api/AuthController.php` — Register, Login, Logout, Me endpoints; revokes old tokens on login

**Form Requests**
- `app/Http/Requests/Auth/RegisterRequest.php` — Validates name, email (unique), password (min 8, confirmed), role (admin/farmer/buyer)
- `app/Http/Requests/Auth/LoginRequest.php` — Validates email and password

**API Resource**
- `app/Http/Resources/UserResource.php` — Transforms user data, conditionally loads roles using `whenLoaded`

**Policy**
- `app/Policies/UserPolicy.php` — Admin-only list, self or admin for view/update, admin-only delete

**Middleware**
- `app/Http/Middleware/CheckRole.php` — Checks if authenticated user has required role slug
- `app/Http/Middleware/VerifyCsrfToken.php` — CSRF middleware with API exclusion for token-based auth

**Routes**
- `routes/api.php` — Auth routes with throttling (`throttle:5,1` for logout, `10,1` for me), protected admin users endpoint

**Seeders**
- `database/seeders/RoleSeeder.php` — Seeds Admin, Farmer, Buyer roles
- `database/seeders/DatabaseSeeder.php`

**Factories**
- `database/factories/UserFactory.php` — With `withRole()` state for attaching roles
- `database/factories/RoleFactory.php`

**Config**
- `config/auth.php` — Sanctum guard configuration
- `config/sanctum.php` — Sanctum driver, token expiration, stateful domains

---

### Setup Required

```bash
# 1. Install Sanctum
composer require laravel/sanctum

# 2. Publish Sanctum (creates config and migration for personal_access_tokens)
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 3. Register middleware alias in bootstrap/app.php (Laravel 12)
# Add inside withMiddleware closure:
# $middleware->alias([
#     'role' => \App\Http\Middleware\CheckRole::class,
# ]);

# 4. Add Sanctum middleware to api middleware stack in bootstrap/app.php
# Ensure 'api' middleware group includes \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class

# 5. Run migrations
php artisan migrate

# 6. Seed roles
php artisan db:seed --class=RoleSeeder
```

### API Endpoints

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| POST | `/api/auth/register` | No | — | Register with role |
| POST | `/api/auth/login` | No | — | Login, returns token |
| POST | `/api/auth/logout` | Yes | 5/min | Revoke current token |
| GET | `/api/auth/me` | Yes | 10/min | Get authenticated user |
| GET | `/api/admin/users` | Admin | 60/min | List all users |

### Security Implemented

- **Sanctum** — Bearer token authentication with plain-text token hashing in DB
- **Password hashing** — `Hash::make()` for registration, `Hash::check()` for login
- **Rate limiting** — Throttle middleware on protected routes
- **Validation** — Form Requests with specific error messages
- **SQL Injection prevention** — Eloquent ORM with parameterized queries; constrained foreign keys
- **XSS prevention** — Laravel API Resources auto-escape JSON; no raw HTML output
- **CSRF** — Token-based auth doesn't require CSRF on API routes; `VerifyCsrfToken` configured
- **Role-based access** — Policy + Middleware enforcement
- **Secure responses** — Password and remember_token excluded from JSON; standardized JSON envelope

---

Awaiting your approval before generating **Module 2: Categories**.

---

## User

Build only authentication.

Roles:

- Admin
- Farmer
- Buyer

Include:

- Registration
- Login
- Logout
- Email verification (optional)
- Password reset
- Sanctum token authentication
- Role middleware

Generate:

- Migration
- Model
- Controller
- Form Request
- API Resource
- Routes

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

Now I'll update the routes file and then verify everything compiles correctly.

**Tool: write**

---

## Assistant

**Tool: bash**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: bash**

---

## Assistant

**Tool: bash**

---

## Assistant

**Tool: read**

---

## Assistant

Authentication module complete. Here's everything generated:

### Files Generated

**Migrations**
- `database/migrations/2026_07_30_000001_create_roles_table.php`
- `database/migrations/2026_07_30_000002_create_users_table.php`
- `database/migrations/2026_07_30_000003_create_role_user_table.php`
- `database/migrations/2026_07_30_000004_create_password_reset_tokens_table.php`
- `database/migrations/2026_07_30_000005_create_sanctum_personal_access_tokens_table.php`

**Models**
- `app/Models/User.php` — Implements `MustVerifyEmail`, uses `HasApiTokens`, defines `roles()` and `hasRole()`
- `app/Models/Role.php` — Role model with `users()` relationship

**Controllers**
- `app/Http/Controllers/Api/AuthController.php` — `register`, `login`, `logout`, `me`, `verifyEmail`, `resendVerification`, `forgotPassword`, `resetPassword`

**Form Requests**
- `app/Http/Requests/Auth/RegisterRequest.php`
- `app/Http/Requests/Auth/LoginRequest.php`
- `app/Http/Requests/Auth/EmailVerificationRequest.php`
- `app/Http/Requests/Auth/ResendVerificationRequest.php`
- `app/Http/Requests/Auth/ForgotPasswordRequest.php`
- `app/Http/Requests/Auth/ResetPasswordRequest.php`

**API Resources**
- `app/Http/Resources/UserResource.php` — Conditionally loads `roles`, exposes `email_verified_at`

**Routes**
- `routes/api.php` — Full auth route group with Sanctum auth, throttling, and admin role middleware

**Notifications**
- `app/Notifications/VerifyEmailNotification.php` — Signed temporary URL valid for 60 minutes
- `app/Notifications/ResetPasswordNotification.php` — Signed reset link

**Middleware & Policies**
- `app/Http/Middleware/CheckRole.php` — Enforces `admin`, `farmer`, or `buyer` access
- `app/Http/Middleware/VerifyCsrfToken.php` — Excludes API routes from CSRF
- `app/Policies/UserPolicy.php` — Admin/self authorization rules

**Seeders & Factories**
- `database/seeders/RoleSeeder.php` — Seeds `admin`, `farmer`, `buyer`
- `database/seeders/DatabaseSeeder.php`
- `database/factories/UserFactory.php` — Supports unverified state and `withRole()`
- `database/factories/RoleFactory.php`

**Config**
- `config/auth.php` — Sanctum guard configuration
- `config/sanctum.php` — Token expiration, stateful domains, middleware

---

### API Endpoints

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| POST | `/api/auth/register` | No | 5/min | Register with role, sends verification email |
| POST | `/api/auth/login` | No | 5/min | Login, returns Bearer token |
| POST | `/api/auth/logout` | Yes | 5/min | Revoke current token |
| GET | `/api/auth/me` | Yes | 10/min | Return authenticated user + roles |
| GET | `/api/auth/verify-email/{id}/{hash}` | No | 10/min | Verify email via signed URL |
| POST | `/api/auth/resend-verification` | No | 5/min | Resend verification email |
| POST | `/api/auth/forgot-password` | No | 5/min | Send password reset link |
| POST | `/api/auth/reset-password` | No | 5/min | Reset password with token |
| GET | `/api/admin/users` | Admin | 60/min | List all users |

---

### Setup Steps

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
php artisan db:seed --class=RoleSeeder
```

Ensure `bootstrap/app.php` registers `CheckRole` as middleware alias and Sanctum middleware is in the `api` group. Configure `MAIL_MAILER` and `APP_URL` in `.env` for email delivery.

---

## User

Build only the Category module.

Include:

- Create category
- Update category
- Delete category
- List categories
- Validation
- Seeder

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: write**

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: read**

---

## Assistant

## Module: Categories

Generated complete Category module with CRUD, nested categories, validation, and role-based access.

### Files Generated

**Migration**
- `database/migrations/2026_07_30_000006_create_categories_table.php` — Self-referential `parent_id` with foreign key, indexes on `parent_id` and `slug`

**Model**
- `app/Models/Category.php` — `parent()` BelongsTo, `children()` HasMany relationships

**Controller**
- `app/Http/Controllers/Api/CategoryController.php` — `index`, `store`, `show`, `update`, `destroy` with search/filter/pagination

**Form Request**
- `app/Http/Requests/CategoryRequest.php` — Validates name, unique slug (ignores current on update), optional parent_id (must exist, not self)

**API Resource**
- `app/Http/Resources/CategoryResource.php` — Transforms category data, conditionally loads parent and children

**Routes**
- `routes/api.php` — Public list/show, authenticated admin|farmer create/update, admin-only delete

**Seeder**
- `database/seeders/CategorySeeder.php` — Seeds Fruits, Vegetables, Dairy, Grains

**Factory**
- `database/factories/CategoryFactory.php` — With `withParent()` state for nested categories

**Policy**
- `app/Policies/CategoryPolicy.php` — Public read, admin|farmer create/update, admin-only delete

---

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/categories` | No | — | List categories (supports `?parent_id=1&search=Fruits&per_page=20`) |
| GET | `/api/categories/{category}` | No | — | Get single category with parent/children |
| POST | `/api/categories` | Yes | Admin, Farmer | Create category |
| PUT | `/api/categories/{category}` | Yes | Admin, Farmer | Update category |
| DELETE | `/api/categories/{category}` | Yes | Admin | Delete category (blocks if children exist) |

---

### Setup Steps

```bash
php artisan migrate
php artisan db:seed --class=CategorySeeder
```

No additional packages required.

---

Awaiting your approval before generating the next module.

---

## User

Build only the Product module.

Include:

- Product CRUD
- Multiple product images
- Search
- Filter
- Pagination
- Product status
- Farmer ownership

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: bash**

---

## Assistant

**Tool: bash**

---

## Assistant

**Tool: read**

**Tool: read**

---

## Assistant

## Module: Products

Generated complete Product module with multi-image support, search, filtering, pagination, and farmer ownership.

### Files Generated

**Migrations**
- `database/migrations/2026_07_30_000008_create_products_table.php` — `farmer_id`, `category_id`, `name`, `description`, `price`, `unit`, `quantity_available`, `status`, `tags` with indexes
- `database/migrations/2026_07_30_000009_create_product_images_table.php` — `product_id`, `image_path`, `alt_text`, `sort_order`

**Models**
- `app/Models/Product.php` — `farmer()`, `category()`, `images()`, `primaryImage()` relationships
- `app/Models/ProductImage.php` — `product()` BelongsTo relationship

**Controller**
- `app/Http/Controllers/Api/ProductController.php` — CRUD with dynamic filters (`search`, `category_id`, `min_price`, `max_price`, `status`, `unit`, `my_products`) and multi-image upload (max 10)

**Form Request**
- `app/Http/Requests/ProductRequest.php` — Validates all product fields, image rules (mimes: jpeg/png/jpg/webp, max 2MB, max 10 files)

**API Resources**
- `app/Http/Resources/ProductResource.php` — Transforms product with farmer, category, images (public URLs via Storage)
- `app/Http/Resources/ProductCollection.php` — Paginated response with `meta` and `links`

**Policy**
- `app/Policies/ProductPolicy.php` — Public read, farmer|admin create, farmer|admin update (own or admin), farmer|admin delete (own or admin)

**Routes**
- `routes/api.php` — Public list/show, authenticated farmer|admin CRUD with throttling

**Seeder**
- `database/seeders/ProductSeeder.php` — Seeds 20 published products for a random farmer with 1–5 images each

**Factories**
- `database/factories/ProductFactory.php` — `published()`, `forFarmer()`, `forCategory()` states
- `database/factories/ProductImageFactory.php`

---

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/products` | No | — | List with filters: `?search=&category_id=&min_price=&max_price=&status=&unit=&my_products=&per_page=` |
| GET | `/api/products/{product}` | No | — | Get single product with images |
| POST | `/api/products` | Yes | Farmer, Admin | Create with multipart form (supports `images[]`) |
| PUT | `/api/products/{product}` | Yes | Farmer, Admin | Update + append images |
| DELETE | `/api/products/{product}` | Yes | Farmer, Admin | Delete product + cascade images |

---

### Setup Steps

```bash
php artisan migrate
php artisan db:seed --class=ProductSeeder
```

Ensure `public/storage` symlink exists for image access:
```bash
php artisan storage:link
```

---

Awaiting your approval before generating the next module.

---

## User

Build only the Cart module.

Include:

- Add to cart
- Remove item
- Update quantity
- Cart total

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

## Module: Cart

Generated complete Cart module with per-user cart, item management, stock validation, and totals.

### Files Generated

**Migrations**
- `database/migrations/2026_07_30_000010_create_carts_table.php` — `user_id` unique foreign key
- `database/migrations/2026_07_30_000011_create_cart_items_table.php` — `cart_id`, `product_id`, `quantity`, `unit_price` with unique composite key

**Models**
- `app/Models/Cart.php` — `user()` BelongsTo, `items()` HasMany
- `app/Models/CartItem.php` — `cart()` BelongsTo, `product()` BelongsTo

**Controller**
- `app/Http/Controllers/Api/CartController.php` — `index`, `store`, `update`, `destroy`, `clear` with stock validation

**Form Request**
- `app/Http/Requests/CartItemRequest.php` — Validates `product_id` exists, `quantity` >= 1

**API Resources**
- `app/Http/Resources/CartResource.php` — Transforms cart with `items`, `total`, `item_count`
- `app/Http/Resources/CartItemResource.php` — Transforms item with `subtotal` and product data

**Policy**
- `app/Policies/CartPolicy.php` — Owner-only access

**Routes**
- `routes/api.php` — Authenticated cart routes with throttling

**Factories**
- `database/factories/CartFactory.php`
- `database/factories/CartItemFactory.php`

**Seeder**
- `database/seeders/CartSeeder.php` — Seeds cart with 3 items for a buyer

---

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | Yes | Get current user's cart with items and total |
| POST | `/api/cart/items` | Yes | Add product to cart (body: `product_id`, `quantity`) |
| PUT | `/api/cart/items/{cart_item}` | Yes | Update item quantity |
| DELETE | `/api/cart/items/{cart_item}` | Yes | Remove item |
| DELETE | `/api/cart/` | Yes | Clear entire cart |

---

### Setup Steps

```bash
php artisan migrate
```

---

Awaiting your approval before generating the next module.

---

## User

Build only the Order module.

Include:

- Checkout
- Order history
- Order status
- Order details

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: bash**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: write**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: edit**

---

## Assistant

Generated complete Order module with checkout, order history, status management, details, and full audit trail.

### Files Generated

**Migrations**
- `database/migrations/2026_07_30_000012_create_orders_table.php` — `order_number` (unique), `user_id`, `status`, `subtotal`, `tax`, `shipping_cost`, `total`, `shipping_address` (JSON), `notes`, `paid_at` with indexes
- `database/migrations/2026_07_30_000013_create_order_items_table.php` — `order_id`, `product_id`, `farmer_id`, snapshotted `product_name`, `product_unit`, `quantity`, `unit_price`, `subtotal` with indexes
- `database/migrations/2026_07_30_000014_create_order_status_histories_table.php` — `order_id`, `status`, `notes`, `created_by` for full audit trail

**Models**
- `app/Models/Order.php` — `user()`, `items()`, `statusHistory()` relationships
- `app/Models/OrderItem.php` — `order()`, `product()`, `farmer()` relationships
- `app/Models/OrderStatusHistory.php` — `order()`, `creator()` relationships

**Controller**
- `app/Http/Controllers/Api/OrderController.php` — 
  - `store()` — Checkout from cart with stock validation, auto-decrements inventory, clears cart, generates order number
  - `index()` — List orders with filters (`status`, `my_orders`, `user_id` for admin)
  - `show()` — Order details with authorization
  - `updateStatus()` — Admin updates any order; Farmers update orders containing their products; status change logged in history

**Form Requests**
- `app/Http/Requests/OrderRequest.php` — Validates nested `shipping_address` (street, city, state, postal_code, country, phone)
- `app/Http/Requests/UpdateOrderStatusRequest.php` — Validates `status` (pending/processing/shipped/delivered/cancelled) and optional `notes`

**API Resources**
- `app/Http/Resources/OrderResource.php` — Transforms order with user, items, status history
- `app/Http/Resources/OrderItemResource.php` — Transforms item with product and farmer details
- `app/Http/Resources/OrderStatusHistoryResource.php` — Transforms history with creator
- `app/Http/Resources/OrderCollection.php` — Paginated orders with meta/links

**Policy**
- `app/Policies/OrderPolicy.php` — Owner or admin can view; authenticated can create; admin or owner can update; admin-only delete

**Routes**
- `routes/api.php` — Added orders route group with checkout, list, show, update-status endpoints

**Factories**
- `database/factories/OrderFactory.php` — `pending()`, `delivered()`, `forUser()` states
- `database/factories/OrderItemFactory.php`
- `database/factories/OrderStatusHistoryFactory.php`

**Seeder**
- `database/seeders/OrderSeeder.php` — Seeds buyer, farmer, products, cart, then creates a delivered order with 3 items and full status history

---

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/orders` | Yes | List orders (`?status=&my_orders=&user_id=&per_page=`) |
| POST | `/api/orders` | Yes | Checkout from cart (body: `shipping_address`, `notes`) |
| GET | `/api/orders/{order}` | Yes | Order details |
| PUT | `/api/orders/{order}/status` | Admin/Farmer | Update order status (body: `status`, `notes`) |

---

### Setup Steps

```bash
php artisan migrate
```

---

Awaiting your approval before generating the next module.

---

## User

Build only the Payment module.

Prepare integration for Paystack or Flutterwave.

Include:

- Payment initialization
- Payment verification
- Transaction history

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: read**

---

## Assistant

Generated complete Payment module with Paystack and Flutterwave integration points, including initialization, verification, and transaction history.

### Files Generated

**Migration**
- `database/migrations/2026_07_30_000015_create_payments_table.php` — `order_id`, `user_id`, `provider`, `reference` (unique), `amount`, `currency`, `status`, `payment_method`, `metadata` with indexes on `user_id`, `order_id`, `status`, `reference`

**Model**
- `app/Models/Payment.php` — `order()` and `user()` BelongsTo relationships

**Controller**
- `app/Http/Controllers/Api/PaymentController.php` — 
  - `initialize()` — Validates order ownership, prevents duplicate pending payments, calls provider
  - `verify()` — Verifies transaction reference, updates payment status, triggers order status update on success
  - `index()` — Transaction history with optional filters (`status`, `order_id`, `from`, `to`); non-admin sees only own payments

**Form Requests**
- `app/Http/Requests/InitializePaymentRequest.php` — Requires `order_id` and `email`
- `app/Http/Requests/VerifyPaymentRequest.php` — Requires `reference`

**API Resources**
- `app/Http/Resources/PaymentResource.php` — Transforms payment with order, user, metadata
- `app/Http/Resources/PaymentCollection.php` — Paginated response with meta/links

**Policy**
- `app/Policies/PaymentPolicy.php` — Owner or admin can view; authenticated can initialize/verify; admin-only update/delete

**Routes**
- `routes/api.php` — 
  - `POST /api/payments/initialize` (auth)
  - `POST /api/payments/verify` (auth)
  - `GET /api/payments` (auth)

**Factories**
- `database/factories/PaymentFactory.php` — `success()`, `pending()`, `paystack()`, `flutterwave()` states

**Seeder**
- `database/seeders/PaymentSeeder.php` — Seeds a successful Paystack payment for a buyer's pending order

**Services**
- `app/Services/PaymentServiceInterface.php` — Contract for `initialize`, `verify`, `getTransactionHistory`
- `app/Services/PaystackService.php` — Paystack integration using HTTP facade
- `app/Services/FlutterwaveService.php` — Flutterwave v3 integration using HTTP facade

**Config**
- `config/payments.php` — Provider selection, base URLs, keys, callback URL, currency

**OrderController fix**
- Removed immediate `paid_at` from checkout so orders start as `pending` until payment is verified

---

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/initialize` | Yes | Initialize payment for order (body: `order_id`, `email`) |
| POST | `/api/payments/verify` | Yes | Verify payment by reference (body: `reference`) |
| GET | `/api/payments` | Yes | Transaction history (`?status=&order_id=&from=&to=&per_page=`) |

---

### Environment Variables

```env
PAYMENT_PROVIDER=paystack

PAYSTACK_BASE_URL=https://api.paystack.co
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key

FLUTTERWAVE_BASE_URL=https://api.flutterwave.com/v3
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST_your_secret_key
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST_your_encryption_key

PAYMENT_CALLBACK_URL=https://your-app.com/api/payments/verify
PAYMENT_CURRENCY=NGN
PAYMENT_WEBHOOK_SECRET=your_webhook_secret
```

### Setup

```bash
php artisan migrate
```

Switch providers by changing `PAYMENT_PROVIDER` in `.env` (`paystack` or `flutterwave`).

---

Awaiting your approval before generating the next module.

---

## User

Build only the Review module.

Include:

- Add review
- Edit review
- Delete review
- Product rating

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: read**

---

## Assistant

## Module: Reviews

Generated complete Review module with CRUD, product ratings, purchase verification, and average rating calculation.

### Files Generated

**Migration**
- `database/migrations/2026_07_30_000016_create_reviews_table.php` — `product_id`, `user_id`, `title`, `comment`, `rating` (1–5) with unique composite key per product-user

**Model**
- `app/Models/Review.php` — `product()` and `user()` BelongsTo relationships; scopes `forProduct()` and `approved()`

**Controller**
- `app/Http/Controllers/Api/ReviewController.php` — 
  - `index()` — List reviews for a product with `per_page` pagination; returns `meta.average_rating` and `meta.review_count`
  - `store()` — Add review; blocks duplicate reviews per user/product; requires user to have purchased the product (or admin)
  - `update()` — Edit review by owner or admin
  - `destroy()` — Delete review by owner or admin

**Form Request**
- `app/Http/Requests/ReviewRequest.php` — Validates `product_id` exists, `rating` (1–5), `comment` (10–2000 chars), optional `title`

**API Resources**
- `app/Http/Resources/ReviewResource.php` — Transforms review with user and product data
- `app/Http/Resources/ReviewCollection.php` — Paginated response with meta/links

**Policy**
- `app/Policies/ReviewPolicy.php` — Public read; authenticated create; owner or admin update/delete

**Routes**
- `routes/api.php` — Added `products/{product}/reviews` route group
  - `GET /api/products/{product}/reviews` — Public, returns reviews + average rating
  - `POST /api/products/{product}/reviews` — Auth required
  - `PUT /api/products/{product}/reviews/{review}` — Auth required
  - `DELETE /api/products/{product}/reviews/{review}` — Auth required

**Factories**
- `database/factories/ReviewFactory.php` — `forProduct()`, `forUser()`, `highRating()` states

**Seeder**
- `database/seeders/ReviewSeeder.php` — Seeds 3 buyers, 5 products, 2–6 high-rating reviews per product with chance of low-rating review

---

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products/{product}/reviews` | No | List reviews with avg rating and count |
| POST | `/api/products/{product}/reviews` | Yes | Add review (requires purchase history) |
| PUT | `/api/products/{product}/reviews/{review}` | Yes | Edit own review |
| DELETE | `/api/products/{product}/reviews/{review}` | Yes | Delete own review |

---

### Setup Steps

```bash
php artisan migrate
php artisan db:seed --class=ReviewSeeder
```

---

Awaiting your approval before generating the next module.

---

## User

Build only the Notification module.

Include:

- Buyer notifications
- Farmer notifications
- Admin notifications

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: write**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: write**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: bash**

---

## Assistant

**Tool: bash**

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: read**

---

## Assistant

Generated complete Notification module with buyer, farmer, and admin notifications, including database storage, read/unread management, and filtering.

### Files Generated

**Migration**
- `database/migrations/2026_07_30_000017_create_notifications_table.php` — `id` (UUID primary), `type`, `notifiable_type`/`notifiable_id` (morphs), `data` (JSON), `read_at`, `created_at` with composite index on notifiable + created_at

**Controller**
- `app/Http/Controllers/Api/NotificationController.php` — 
  - `index()` — Paginated notifications with optional `type` and `unread` filters
  - `show()` — Single notification, auto-marks as read when viewed
  - `markAsRead()` — Mark single notification as read
  - `markAllAsRead()` — Mark all unread notifications as read
  - `unreadCount()` — Get unread count
  - `destroy()` — Delete notification

**Form Request**
- None required — all inputs are validated via query parameters (`type`, `unread`, `per_page`)

**API Resources**
- `app/Http/Resources/NotificationResource.php` — Transforms notification with `title`, `message`, `type`, `action_url`, `read`, `created_at`
- `app/Http/Resources/NotificationCollection.php` — Paginated response with meta/links and `unread_count`

**Routes**
- `routes/api.php` — Added `notifications` route group under auth:
  - `GET /api/notifications` — List with filters (`?type=&unread=&per_page=`)
  - `GET /api/notifications/unread-count` — Get unread count
  - `GET /api/notifications/{notification}` — View single (auto-read)
  - `PUT /api/notifications/{notification}/read` — Mark as read
  - `PUT /api/notifications/read-all` — Mark all as read
  - `DELETE /api/notifications/{notification}` — Delete notification

**Seeder**
- `database/seeders/NotificationSeeder.php` — Seeds notifications for all users using actual notification classes

**Notification Classes**
Buyer notifications:
- `BuyerOrderPlacedNotification` — Sent when order is placed
- `BuyerOrderStatusUpdatedNotification` — Sent when order status changes

Farmer notifications:
- `FarmerNewOrderNotification` — Sent when farmer receives a new order
- `FarmerOrderStatusUpdatedNotification` — Sent when order status changes
- `FarmerReviewReceivedNotification` — Sent when product receives a review

Admin notifications:
- `AdminNewOrderNotification` — Sent when a new order is placed

**Other Notifications:**
- `PaymentSuccessNotification` — Sent when payment is verified successfully

---

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications` | Yes | List with `?type=&unread=&per_page=` |
| GET | `/api/notifications/unread-count` | Yes | Get unread count |
| GET | `/api/notifications/{notification}` | Yes | View single (auto-read) |
| PUT | `/api/notifications/{notification}/read` | Yes | Mark as read |
| PUT | `/api/notifications/read-all` | Yes | Mark all as read |
| DELETE | `/api/notifications/{notification}` | Yes | Delete notification |

---

### Setup Steps

```bash
php artisan migrate
```

### Usage Example

Send a notification to a buyer when their order is placed:
```php
$order = Order::create([...]);
$order->user->notify(new BuyerOrderPlacedNotification($order));
$admins = User::whereHas('roles', fn($q) => $q->where('slug', 'admin'))->get();
foreach ($admins as $admin) {
    $admin->notify(new AdminNewOrderNotification($order));
}
```

---

Awaiting your approval before generating the next module.

---

## User

Build only the Admin module.

Include:

- User management
- Product management
- Order management
- Dashboard statistics
- Reports

---

## Assistant

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

**Tool: read**

---

## Assistant

**Tool: bash**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

**Tool: write**

**Tool: write**

**Tool: write**

---

## Assistant

**Tool: write**

---

## Assistant

**Tool: read**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: edit**

---

## Assistant

**Tool: read**

---

## Assistant

## Module: Admin

Generated complete Admin module with dashboard statistics, user management, product management, order management, and reports.

### Files Generated

**Controller**
- `app/Http/Controllers/Api/AdminController.php` — Single controller handling all admin operations:
  - `dashboard()` — Returns comprehensive stats with optional `from`/`to` date filters
  - `users()` — List users with search and role filter
  - `showUser()` — Get single user details with roles
  - `updateUser()` — Update user name, email, role, or verification status
  - `deleteUser()` — Delete user
  - `products()` — List all products with search, status, and farmer filters
  - `updateProduct()` — Update product status (admin override)
  - `deleteProduct()` — Delete product and cascade images
  - `orders()` — List all orders with status and user filters
  - `showOrder()` — Get order details with items and farmer info
  - `updateOrder()` — Update order status
  - `salesReport()` — Daily sales report with totals and averages for a date range
  - `topProducts()` — Best-selling products by revenue
  - `topFarmers()` — Top farmers by revenue

**Form Requests**
- `app/Http/Requests/Admin/UserUpdateRequest.php` — Validates name, email (unique), role (exists), email_verified_at
- `app/Http/Requests/Admin/ProductUpdateRequest.php` — Validates status (draft/published/archived)
- `app/Http/Requests/Admin/OrderUpdateRequest.php` — Validates status (pending/processing/shipped/delivered/cancelled)

**API Resources**
- `app/Http/Resources/Admin/UserResource.php` — Transforms user with roles
- `app/Http/Resources/Admin/ProductResource.php` — Transforms product with farmer and category
- `app/Http/Resources/Admin/OrderResource.php` — Transforms order with user and items count
- `app/Http/Resources/Admin/DashboardStatsResource.php` — Pass-through resource for raw dashboard statistics

**Routes**
- `routes/api.php` — Added `/api/admin` route group with auth + admin role middleware:
  - `GET /api/admin/dashboard` — Dashboard statistics
  - `GET /api/admin/users` — List users
  - `GET /api/admin/users/{user}` — Show user
  - `PUT /api/admin/users/{user}` — Update user
  - `DELETE /api/admin/users/{user}` — Delete user
  - `GET /api/admin/products` — List all products
  - `PUT /api/admin/products/{product}` — Update product status
  - `DELETE /api/admin/products/{product}` — Delete product
  - `GET /api/admin/orders` — List all orders
  - `GET /api/admin/orders/{order}` — Show order details
  - `PUT /api/admin/orders/{order}` — Update order status
  - `GET /api/admin/reports/sales` — Sales report (`?from=&to=`)
  - `GET /api/admin/reports/top-products` — Top products (`?limit=`)
  - `GET /api/admin/reports/top-farmers` — Top farmers (`?limit=`)

---

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Dashboard stats (users, products, orders, revenue) |
| GET | `/api/admin/users` | Admin | List users with search/role filter |
| GET | `/api/admin/users/{user}` | Admin | Show user details |
| PUT | `/api/admin/users/{user}` | Admin | Update user (name, email, role, verification) |
| DELETE | `/api/admin/users/{user}` | Admin | Delete user |
| GET | `/api/admin/products` | Admin | List all products with filters |
| PUT | `/api/admin/products/{product}` | Admin | Update product status |
| DELETE | `/api/admin/products/{product}` | Admin | Delete product |
| GET | `/api/admin/orders` | Admin | List all orders with filters |
| GET | `/api/admin/orders/{order}` | Admin | Show order details |
| PUT | `/api/admin/orders/{order}` | Admin | Update order status |
| GET | `/api/admin/reports/sales` | Admin | Sales report by date range |
| GET | `/api/admin/reports/top-products` | Admin | Top products by revenue |
| GET | `/api/admin/reports/top-farmers` | Admin | Top farmers by revenue |

---

### Setup Steps

```bash
php artisan migrate
```

No additional packages required.

---

Awaiting your approval before generating the next module.

---

## User

is all the files inside this folder that i open

---

## Assistant

**Tool: bash**

---


<?php

namespace App\Services;

use App\Models\Order;
use Exception;

interface PaymentServiceInterface
{
    public function initialize(Order $order, ?string $email = null, ?string $callbackUrl = null): array;

    public function verify(string $reference): array;

    public function getTransactionHistory(string $userId, ?string $from = null, ?string $to = null): array;
}

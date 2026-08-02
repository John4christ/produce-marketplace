<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FarmerController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        return response()->json([
            "success" => true,
            "data" => [

                "stats" => [
                    "monthlyRevenue" => 12840,
                    "activeListings" => 18,
                    "pendingOrders" => 9,
                    "newBuyers" => 24,
                ],

                "wallet" => [
                    "balance" => 12840,
                    "pending" => 3450,
                    "earnedThisMonth" => 8920,
                ],

                "orders" => [],

                "products" => [],

                "notifications" => [],

                "user" => $user

            ]
        ]);
    }
}
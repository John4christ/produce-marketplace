<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PaymentResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'delivery_method' => $this->delivery_method,
            'subtotal' => $this->subtotal,
            'tax' => $this->tax,
            'shipping_cost' => $this->shipping_cost,
            'total' => $this->total,
            'shipping_address' => $this->shipping_address,
            'notes' => $this->notes,
            'paid_at' => $this->paid_at,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'status_history' => $this->whenLoaded('statusHistory', fn () => OrderStatusHistoryResource::collection($this->statusHistory)),
            'payments' => $this->whenLoaded('payments', fn () => PaymentResource::collection($this->payments)),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

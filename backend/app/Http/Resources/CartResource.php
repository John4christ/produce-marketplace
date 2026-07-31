<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items');

        $total = $items ? $items->sum(fn ($item) => $item->quantity * $item->unit_price) : 0;
        $count = $items ? $items->sum('quantity') : 0;

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'items' => CartItemResource::collection($items),
            'total' => number_format($total, 2, '.', ''),
            'item_count' => $count,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

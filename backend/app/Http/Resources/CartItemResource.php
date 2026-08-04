<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'subtotal' => $this->quantity * $this->unit_price,
            'product' => $this->whenLoaded('product', fn () => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'unit' => $this->product->unit,
                'price' => $this->product->price,
                'quantity_available' => $this->product->quantity_available,
                'images' => $this->product->images->map(fn ($image) => [
                    'url' => \Illuminate\Support\Facades\Storage::disk('public')->url($image->image_path),
                    'alt_text' => $image->alt_text,
                ]),
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

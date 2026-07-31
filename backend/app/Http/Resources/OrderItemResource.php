<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_name' => $this->product_name,
            'product_unit' => $this->product_unit,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'subtotal' => $this->subtotal,
            'product' => $this->whenLoaded('product', fn () => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'images' => $this->product->images->map(fn ($image) => [
                    'url' => \Illuminate\Support\Facades\Storage::disk('public')->url($image->image_path),
                ]),
            ]),
            'farmer' => $this->whenLoaded('farmer', fn () => [
                'id' => $this->farmer->id,
                'name' => $this->farmer->name,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

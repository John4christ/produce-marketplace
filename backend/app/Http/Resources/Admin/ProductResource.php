<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'unit' => $this->unit,
            'quantity_available' => $this->quantity_available,
            'status' => $this->status,
            'farmer' => $this->whenLoaded('farmer', fn () => [
                'id' => $this->farmer->id,
                'name' => $this->farmer->name,
                'email' => $this->farmer->email,
            ]),
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

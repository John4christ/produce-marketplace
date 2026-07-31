<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ReviewCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'current_page' => $this->collection->currentPage(),
                'last_page' => $this->collection->lastPage(),
                'per_page' => $this->collection->perPage(),
                'total' => $this->collection->total(),
            ],
            'links' => [
                'first' => $this->collection->url(1),
                'last' => $this->collection->url($this->collection->lastPage()),
                'prev' => $this->collection->previousPageUrl(),
                'next' => $this->collection->nextPageUrl(),
            ],
        ];
    }
}

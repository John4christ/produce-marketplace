<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->data['title'] ?? 'Notification',
            'message' => $this->data['message'] ?? '',
            'type' => $this->data['type'] ?? 'general',
            'action_url' => $this->data['action_url'] ?? null,
            'read' => !is_null($this->read_at),
            'read_at' => $this->read_at,
            'created_at' => $this->created_at,
        ];
    }
}

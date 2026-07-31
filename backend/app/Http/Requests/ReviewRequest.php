<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $reviewId = $this->route('review')?->id ?? $this->route('review');

        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:10', 'max:2000'],
            'title' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'rating.min' => 'Rating must be at least 1 star.',
            'rating.max' => 'Rating must not exceed 5 stars.',
            'comment.min' => 'Comment must be at least 10 characters.',
            'comment.max' => 'Comment must not exceed 2000 characters.',
        ];
    }
}

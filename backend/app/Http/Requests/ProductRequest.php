<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id ?? $this->route('product');

        return [
            'farmer_id' => ['nullable', 'integer', 'exists:users,id'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
            'quantity_available' => ['required', 'integer', 'min:0'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:100'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'The status must be one of: draft, published, archived.',
            'images.max' => 'You may upload a maximum of 10 images.',
            'images.*.image' => 'Each file must be an image.',
            'images.*.mimes' => 'Image format must be jpeg, png, jpg, or webp.',
            'images.*.max' => 'Each image must not exceed 2MB.',
        ];
    }
}

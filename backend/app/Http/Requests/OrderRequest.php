<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_address' => ['required', 'array'],
            'shipping_address.full_name' => ['required', 'string', 'max:255'],
            'shipping_address.email' => ['required', 'email', 'max:255'],
            'shipping_address.phone' => ['nullable', 'string', 'max:20'],
            'shipping_address.street' => ['required', 'string', 'max:255'],
            'shipping_address.city' => ['required', 'string', 'max:100'],
            'shipping_address.state' => ['required', 'string', 'max:100'],
            'shipping_address.postal_code' => ['required', 'string', 'max:20'],
            'shipping_address.country' => ['required', 'string', 'max:100'],
            'shipping_address.note' => ['nullable', 'string', 'max:1000'],
            'delivery_method' => ['required', 'string', 'in:standard,express,pickup'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'shipping_address.required' => 'Shipping address is required.',
            'shipping_address.full_name.required' => 'Full name is required.',
            'shipping_address.email.required' => 'Email is required.',
            'shipping_address.email.email' => 'Please enter a valid email address.',
            'shipping_address.phone.required' => 'Phone number is required.',
            'shipping_address.street.required' => 'Street address is required.',
            'shipping_address.city.required' => 'City is required.',
            'shipping_address.state.required' => 'State is required.',
            'shipping_address.postal_code.required' => 'Postal code is required.',
            'shipping_address.country.required' => 'Country is required.',
        ];
    }
}

<?php

namespace App\Modules\Media\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEditorImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('media.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'alt' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'Please select an image to upload.',
            'image.image' => 'The selected file must be a valid image.',
            'image.mimes' => 'Only JPG, PNG, and WebP images are allowed.',
            'image.max' => 'Editor images may not be larger than 5 MB.',
        ];
    }
}

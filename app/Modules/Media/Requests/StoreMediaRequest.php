<?php

namespace App\Modules\Media\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:image,video'],
            'file' => [
                Rule::requiredIf(fn () => $this->input('type') === 'image' || ($this->input('type') === 'video' && blank($this->input('embed_url')))),
                'nullable',
                'file',
                'max:51200',
            ],
            'embed_url' => [
                'nullable',
                'url',
                Rule::requiredIf(fn () => $this->input('type') === 'video' && ! $this->hasFile('file')),
            ],
            'translations' => 'required|array',
            'translations.*.title' => 'nullable|string|max:255',
            'translations.*.description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Upload a file for images, or provide either a file or embed URL for videos.',
            'embed_url.required' => 'Provide an embed URL or upload a video file.',
        ];
    }
}

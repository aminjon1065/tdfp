<?php

namespace App\Modules\CMS\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PreviewPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAny([
            'pages.create',
            'pages.edit',
            'pages.publish',
        ]) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:draft,published,archived',
            'translations' => 'required|array',
            'translations.*.title' => 'required|string|max:255',
            'translations.*.content' => 'nullable|string',
            'translations.*.meta_title' => 'nullable|string|max:255',
            'translations.*.meta_description' => 'nullable|string|max:500',
        ];
    }
}

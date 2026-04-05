<?php

namespace App\Modules\News\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'nullable|exists:news_categories,id',
            'featured_image' => 'nullable|image|max:5120',
            'is_featured' => 'boolean',
            'status' => 'required|in:draft,published,archived',
            'translations' => 'required|array',
            'translations.*.title' => 'required|string|max:255',
            'translations.*.summary' => 'nullable|string|max:1000',
            'translations.*.content' => 'nullable|string',
        ];
    }
}

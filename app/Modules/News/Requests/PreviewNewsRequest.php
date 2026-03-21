<?php

namespace App\Modules\News\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PreviewNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAny([
            'news.create',
            'news.edit',
            'news.publish',
        ]) ?? false;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'nullable|exists:news_categories,id',
            'is_featured' => 'boolean',
            'status' => 'required|in:draft,published,archived',
            'featured_image_url' => 'nullable|string|max:2048',
            'translations' => 'required|array',
            'translations.*.title' => 'required|string|max:255',
            'translations.*.summary' => 'nullable|string|max:1000',
            'translations.*.content' => 'nullable|string',
        ];
    }
}

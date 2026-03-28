<?php
namespace App\Modules\Activities\Requests;
use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'status' => 'required|in:planned,in_progress,completed',
            'domain_slug' => 'nullable|string|max:64',
            'activity_number' => 'nullable|integer|min:1|max:999',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'featured_image' => 'nullable|image|max:5120',
            'translations' => 'required|array',
            'translations.*.title' => 'required|string|max:255',
            'translations.*.description' => 'nullable|string',
            'translations.*.objectives' => 'nullable|string',
        ];
    }
}

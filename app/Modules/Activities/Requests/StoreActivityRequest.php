<?php
namespace App\Modules\Activities\Requests;
use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'status' => 'required|in:planned,in_progress,completed',
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

<?php
namespace App\Modules\Media\Requests;
use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'type' => 'required|in:image,video',
            'file' => 'nullable|file|max:51200',
            'embed_url' => 'nullable|url',
            'translations' => 'required|array',
            'translations.*.title' => 'nullable|string|max:255',
            'translations.*.description' => 'nullable|string',
        ];
    }
}

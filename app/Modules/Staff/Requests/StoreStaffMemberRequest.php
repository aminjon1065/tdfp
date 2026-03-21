<?php

namespace App\Modules\Staff\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreStaffMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'parent_id' => ['nullable', 'exists:staff_members,id'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'photo' => ['nullable', 'image', 'max:5120'],
            'is_leadership' => ['sometimes', 'boolean'],
            'is_published' => ['sometimes', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'translations' => ['required', 'array:en,ru,tj'],
            'translations.en.full_name' => ['required', 'string', 'max:255'],
            'translations.ru.full_name' => ['required', 'string', 'max:255'],
            'translations.tj.full_name' => ['required', 'string', 'max:255'],
            'translations.en.job_title' => ['required', 'string', 'max:255'],
            'translations.ru.job_title' => ['required', 'string', 'max:255'],
            'translations.tj.job_title' => ['required', 'string', 'max:255'],
            'translations.*.department' => ['nullable', 'string', 'max:255'],
            'translations.*.biography' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'parent_id.exists' => 'The selected manager is invalid.',
            'photo.image' => 'The staff photo must be an image file.',
            'translations.en.full_name.required' => 'The English full name is required.',
            'translations.ru.full_name.required' => 'The Russian full name is required.',
            'translations.tj.full_name.required' => 'The Tajik full name is required.',
            'translations.en.job_title.required' => 'The English job title is required.',
            'translations.ru.job_title.required' => 'The Russian job title is required.',
            'translations.tj.job_title.required' => 'The Tajik job title is required.',
        ];
    }
}

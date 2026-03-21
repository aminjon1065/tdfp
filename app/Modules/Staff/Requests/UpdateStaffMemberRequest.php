<?php

namespace App\Modules\Staff\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffMemberRequest extends FormRequest
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
        $staffMemberId = $this->route('staff_member')?->id;

        return [
            'parent_id' => [
                'nullable',
                'exists:staff_members,id',
                Rule::notIn([$staffMemberId]),
            ],
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
            'parent_id.not_in' => 'A staff member cannot report to themselves.',
        ];
    }
}

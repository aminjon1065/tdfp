<?php

namespace App\Modules\GRM\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGrmStatusRequest extends FormRequest
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
            'status' => ['required', 'in:submitted,under_review,investigation,resolved,closed'],
            'officer_id' => ['nullable', 'exists:users,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => 'A GRM status is required.',
            'status.in' => 'The selected GRM status is invalid.',
            'officer_id.exists' => 'The selected officer does not exist.',
        ];
    }
}

<?php

namespace App\Modules\Procurement\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProcurementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference_number' => 'required|string|max:100|unique:procurements,reference_number',
            'status' => 'required|in:open,closed,awarded,archived',
            'publication_date' => 'nullable|date',
            'deadline' => 'nullable|date',
            'document_ids' => 'nullable|array',
            'document_ids.*' => 'exists:documents,id',
            'translations' => 'required|array',
            'translations.*.title' => 'required|string|max:255',
            'translations.*.description' => 'nullable|string',
        ];
    }
}

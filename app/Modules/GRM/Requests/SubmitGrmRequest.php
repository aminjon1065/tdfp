<?php
namespace App\Modules\GRM\Requests;
use Illuminate\Foundation\Http\FormRequest;

class SubmitGrmRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'complainant_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'category' => 'required|in:procurement,project_implementation,environment_social,corruption,other',
            'description' => 'required|string|min:20|max:5000',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'file|max:10240',
        ];
    }
}

<?php

namespace App\Modules\Settings\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
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
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable', 'string'],
            'settings.analytics_enabled' => ['nullable', 'in:0,1,true,false'],
            'settings.analytics_provider' => ['nullable', 'in:ga4'],
            'settings.google_analytics_id' => ['nullable', 'regex:/^G-[A-Z0-9]+$/'],
            'settings.analytics_owner_name' => ['nullable', 'string', 'max:255'],
            'settings.analytics_owner_email' => ['nullable', 'email', 'max:255'],
            'settings.support_contact_name' => ['nullable', 'string', 'max:255'],
            'settings.support_contact_email' => ['nullable', 'email', 'max:255'],
            'settings.support_contact_phone' => ['nullable', 'string', 'max:50'],
            'settings.support_hours' => ['nullable', 'string', 'max:255'],
            'settings.incident_contact_email' => ['nullable', 'email', 'max:255'],
            'settings.maintenance_report_email' => ['nullable', 'email', 'max:255'],
            'settings.backup_frequency' => ['nullable', 'in:daily,weekly,monthly'],
            'settings.backup_retention_days' => ['nullable', 'integer', 'min:1', 'max:3650'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'settings.required' => 'Settings payload is required.',
            'settings.array' => 'Settings payload must be a key-value object.',
            'settings.google_analytics_id.regex' => 'Google Analytics ID must use GA4 format like G-XXXXXXX.',
            'settings.analytics_provider.in' => 'The selected analytics provider is invalid.',
            'settings.analytics_owner_email.email' => 'Analytics owner email must be a valid email address.',
            'settings.support_contact_email.email' => 'Support contact email must be a valid email address.',
            'settings.incident_contact_email.email' => 'Incident contact email must be a valid email address.',
            'settings.maintenance_report_email.email' => 'Maintenance report email must be a valid email address.',
            'settings.backup_frequency.in' => 'Backup frequency must be daily, weekly, or monthly.',
            'settings.backup_retention_days.integer' => 'Backup retention days must be a whole number.',
        ];
    }
}

<?php

namespace App\Modules\GRM\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitGrmRequest extends FormRequest
{
    public const array ALLOWED_ATTACHMENT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];

    public const int MAX_ATTACHMENTS = 5;

    public const int MAX_ATTACHMENT_SIZE_KB = 10240;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'complainant_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'category' => 'required|in:procurement,project_implementation,environment_social,corruption,other',
            'description' => 'required|string|min:20|max:5000',
            'attachments' => 'nullable|array|max:'.self::MAX_ATTACHMENTS,
            'attachments.*' => 'file|mimes:'.implode(',', self::ALLOWED_ATTACHMENT_EXTENSIONS).'|max:'.self::MAX_ATTACHMENT_SIZE_KB,
        ];
    }

    public static function attachmentAcceptAttribute(): string
    {
        return implode(',', array_map(
            fn (string $extension): string => '.'.$extension,
            self::ALLOWED_ATTACHMENT_EXTENSIONS,
        ));
    }

    public static function maxAttachmentSizeMb(): int
    {
        return (int) ceil(self::MAX_ATTACHMENT_SIZE_KB / 1024);
    }
}

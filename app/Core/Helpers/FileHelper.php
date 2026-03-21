<?php

namespace App\Core\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileHelper
{
    public static function store(UploadedFile $file, string $directory, string $disk = 'public'): string
    {
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs($directory, $filename, $disk);

        return $path;
    }

    public static function delete(?string $path, string $disk = 'public'): void
    {
        if ($path && Storage::disk($disk)->exists($path)) {
            Storage::disk($disk)->delete($path);
        }
    }

    public static function url(?string $path, string $disk = 'public'): ?string
    {
        if (! $path) {
            return null;
        }

        return Storage::disk($disk)->url($path);
    }
}

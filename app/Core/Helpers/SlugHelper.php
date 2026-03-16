<?php

namespace App\Core\Helpers;

use Illuminate\Support\Str;

class SlugHelper
{
    public static function generate(string $text, string $model, int $ignoreId = 0): string
    {
        $slug = Str::slug($text);
        $original = $slug;
        $count = 1;

        while (
            $model::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$original}-{$count}";
            $count++;
        }

        return $slug;
    }
}

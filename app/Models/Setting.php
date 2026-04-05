<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    private const NULL_CACHE_SENTINEL = '__setting_null__';

    protected $fillable = ['key', 'value', 'group', 'type'];

    /**
     * @param  array<string, mixed>  $defaults
     * @return array<string, mixed>
     */
    public static function many(array $keys, array $defaults = []): array
    {
        $settings = [];

        foreach ($keys as $key) {
            $settings[$key] = static::get($key, $defaults[$key] ?? null);
        }

        return $settings;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $value = Cache::remember("setting:{$key}", now()->addHour(), function () use ($key) {
            return static::where('key', $key)->value('value') ?? self::NULL_CACHE_SENTINEL;
        });

        if ($value === self::NULL_CACHE_SENTINEL) {
            return $default;
        }

        return $value ?? $default;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("setting:{$key}");
    }
}

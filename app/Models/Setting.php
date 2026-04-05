<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    private const NULL_CACHE_SENTINEL = '__setting_null__';

    private const CACHE_TTL_IN_SECONDS = 3600;

    protected $fillable = ['key', 'value', 'group', 'type'];

    /**
     * @param  array<string, mixed>  $defaults
     * @return array<string, mixed>
     */
    public static function many(array $keys, array $defaults = []): array
    {
        $settings = [];
        $missingKeys = [];
        $cachedValues = Cache::many(array_map(
            fn (string $key) => static::cacheKey($key),
            $keys,
        ));

        foreach ($keys as $key) {
            $cacheKey = static::cacheKey($key);
            $cachedValue = $cachedValues[$cacheKey] ?? null;

            if ($cachedValue === null) {
                $missingKeys[] = $key;

                continue;
            }

            $settings[$key] = static::resolveCachedValue($cachedValue, $defaults[$key] ?? null);
        }

        if ($missingKeys === []) {
            return $settings;
        }

        $databaseValues = static::query()
            ->whereIn('key', $missingKeys)
            ->pluck('value', 'key')
            ->all();

        $cachePayload = [];

        foreach ($missingKeys as $key) {
            $cacheValue = $databaseValues[$key] ?? self::NULL_CACHE_SENTINEL;

            $cachePayload[static::cacheKey($key)] = $cacheValue;
            $settings[$key] = static::resolveCachedValue($cacheValue, $defaults[$key] ?? null);
        }

        Cache::putMany($cachePayload, self::CACHE_TTL_IN_SECONDS);

        return $settings;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return static::many([$key], [$key => $default])[$key];
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget(static::cacheKey($key));
    }

    private static function cacheKey(string $key): string
    {
        return "setting:{$key}";
    }

    private static function resolveCachedValue(mixed $value, mixed $default): mixed
    {
        if ($value === self::NULL_CACHE_SENTINEL) {
            return $default;
        }

        return $value ?? $default;
    }
}

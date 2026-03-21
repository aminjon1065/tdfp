<?php

namespace App\Modules\CMS\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class EditorialPreviewStore
{
    public function put(string $type, int $userId, array $payload): string
    {
        $token = (string) Str::uuid();

        Cache::put($this->cacheKey($type, $token), [
            'type' => $type,
            'user_id' => $userId,
            'payload' => $payload,
        ], now()->addMinutes(30));

        return $token;
    }

    public function get(string $type, string $token, int $userId): ?array
    {
        /** @var array{type: string, user_id: int, payload: array<string, mixed>}|null $preview */
        $preview = Cache::get($this->cacheKey($type, $token));

        if ($preview === null || $preview['type'] !== $type || $preview['user_id'] !== $userId) {
            return null;
        }

        return $preview['payload'];
    }

    private function cacheKey(string $type, string $token): string
    {
        return "editorial_preview:{$type}:{$token}";
    }
}

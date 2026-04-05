<?php

namespace App;

enum ActivityStatus: string
{
    case Planned = 'planned';
    case InProgress = 'in_progress';
    case Completed = 'completed';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return list<string>
     */
    public static function publicValues(): array
    {
        return self::values();
    }

    public static function isPublic(self|string|null $status): bool
    {
        if ($status instanceof self) {
            return in_array($status, self::cases(), true);
        }

        return in_array($status, self::publicValues(), true);
    }
}

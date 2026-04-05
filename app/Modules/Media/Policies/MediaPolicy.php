<?php

namespace App\Modules\Media\Policies;

use App\Models\MediaItem;
use App\Models\User;

class MediaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('media.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('media.create');
    }

    public function delete(User $user, MediaItem $item): bool
    {
        return $user->hasPermissionTo('media.delete');
    }
}

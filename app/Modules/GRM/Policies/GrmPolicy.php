<?php

namespace App\Modules\GRM\Policies;

use App\Models\GrmCase;
use App\Models\User;

class GrmPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('grm.view');
    }

    public function view(User $user, GrmCase $case): bool
    {
        return $user->hasPermissionTo('grm.view');
    }

    public function updateStatus(User $user, GrmCase $case): bool
    {
        return $user->hasAnyPermission(['grm.update_status', 'grm.assign', 'grm.close']);
    }

    public function message(User $user, GrmCase $case): bool
    {
        return $user->hasPermissionTo('grm.message');
    }
}

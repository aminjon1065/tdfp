<?php

namespace App\Modules\GRM\Policies;

use App\Models\GrmCase;
use App\Models\User;

class GrmPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return null;
    }

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
        return $user->hasAnyPermission(['grm.update_status', 'grm.assign', 'grm.close'])
            && $this->hasOperationalAccess($user, $case);
    }

    public function message(User $user, GrmCase $case): bool
    {
        return $user->hasPermissionTo('grm.message')
            && $this->hasOperationalAccess($user, $case);
    }

    public function viewSensitiveData(User $user, GrmCase $case): bool
    {
        return $user->hasAnyPermission([
            'grm.assign',
            'grm.update_status',
            'grm.close',
            'grm.message',
        ]) && $this->hasOperationalAccess($user, $case);
    }

    private function hasOperationalAccess(User $user, GrmCase $case): bool
    {
        if ($case->assigned_to === null) {
            return true;
        }

        return $case->assigned_to === $user->id;
    }
}

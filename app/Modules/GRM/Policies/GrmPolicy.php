<?php
namespace App\Modules\GRM\Policies;
use App\Models\User;
use App\Models\GrmCase;

class GrmPolicy
{
    public function viewAny(User $user): bool { return $user->hasPermissionTo('grm.view'); }
    public function updateStatus(User $user, GrmCase $case): bool { return $user->hasPermissionTo('grm.update_status'); }
    public function message(User $user, GrmCase $case): bool { return $user->hasPermissionTo('grm.message'); }
}

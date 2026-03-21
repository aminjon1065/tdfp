<?php

namespace App\Modules\Staff\Policies;

use App\Models\StaffMember;
use App\Models\User;

class StaffMemberPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('staff.view');
    }

    public function view(User $user, StaffMember $staffMember): bool
    {
        return $user->hasPermissionTo('staff.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('staff.create');
    }

    public function update(User $user, StaffMember $staffMember): bool
    {
        return $user->hasPermissionTo('staff.edit');
    }

    public function delete(User $user, StaffMember $staffMember): bool
    {
        return $user->hasPermissionTo('staff.delete');
    }
}

<?php
namespace App\Modules\Activities\Policies;
use App\Models\User;
use App\Models\Activity;

class ActivityPolicy
{
    public function viewAny(User $user): bool { return $user->hasPermissionTo('activities.view'); }
    public function create(User $user): bool { return $user->hasPermissionTo('activities.create'); }
    public function update(User $user, Activity $activity): bool { return $user->hasPermissionTo('activities.edit'); }
    public function delete(User $user, Activity $activity): bool { return $user->hasPermissionTo('activities.delete'); }
}

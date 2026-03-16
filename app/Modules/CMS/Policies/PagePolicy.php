<?php
namespace App\Modules\CMS\Policies;
use App\Models\User;
use App\Models\Page;

class PagePolicy
{
    public function viewAny(User $user): bool { return $user->hasPermissionTo('pages.view'); }
    public function create(User $user): bool { return $user->hasPermissionTo('pages.create'); }
    public function update(User $user, Page $page): bool { return $user->hasPermissionTo('pages.edit'); }
    public function delete(User $user, Page $page): bool { return $user->hasPermissionTo('pages.delete'); }
    public function publish(User $user, Page $page): bool { return $user->hasPermissionTo('pages.publish'); }
}

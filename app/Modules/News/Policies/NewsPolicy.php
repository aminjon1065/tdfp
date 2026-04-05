<?php

namespace App\Modules\News\Policies;

use App\Models\News;
use App\Models\User;

class NewsPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('news.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('news.create');
    }

    public function update(User $user, News $news): bool
    {
        return $user->hasPermissionTo('news.edit');
    }

    public function delete(User $user, News $news): bool
    {
        return $user->hasPermissionTo('news.delete');
    }

    public function publish(User $user, News $news): bool
    {
        return $user->hasPermissionTo('news.publish');
    }
}

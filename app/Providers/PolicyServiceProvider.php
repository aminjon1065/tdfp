<?php

namespace App\Providers;

use App\Models\Activity;
use App\Models\Document;
use App\Models\GrmCase;
use App\Models\MediaItem;
use App\Models\News;
use App\Models\Page;
use App\Models\Procurement;
use App\Models\StaffMember;
use App\Models\User;
use App\Modules\Activities\Policies\ActivityPolicy;
use App\Modules\CMS\Policies\PagePolicy;
use App\Modules\Documents\Policies\DocumentPolicy;
use App\Modules\GRM\Policies\GrmPolicy;
use App\Modules\Media\Policies\MediaPolicy;
use App\Modules\News\Policies\NewsPolicy;
use App\Modules\Procurement\Policies\ProcurementPolicy;
use App\Modules\Staff\Policies\StaffMemberPolicy;
use App\Modules\Users\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class PolicyServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Gate::policy(Page::class, PagePolicy::class);
        Gate::policy(News::class, NewsPolicy::class);
        Gate::policy(Activity::class, ActivityPolicy::class);
        Gate::policy(Document::class, DocumentPolicy::class);
        Gate::policy(Procurement::class, ProcurementPolicy::class);
        Gate::policy(MediaItem::class, MediaPolicy::class);
        Gate::policy(GrmCase::class, GrmPolicy::class);
        Gate::policy(StaffMember::class, StaffMemberPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }
}

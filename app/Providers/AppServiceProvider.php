<?php

namespace App\Providers;

use App\Core\Observers\AuditObserver;
use App\Models\Activity;
use App\Models\Document;
use App\Models\GrmCase;
use App\Models\MediaItem;
use App\Models\News;
use App\Models\Page;
use App\Models\Procurement;
use App\Models\User;
use App\Modules\Activities\Policies\ActivityPolicy;
use App\Modules\CMS\Policies\PagePolicy;
use App\Modules\Documents\Policies\DocumentPolicy;
use App\Modules\GRM\Policies\GrmPolicy;
use App\Modules\Media\Policies\MediaPolicy;
use App\Modules\News\Policies\NewsPolicy;
use App\Modules\Procurement\Policies\ProcurementPolicy;
use App\Modules\Users\Policies\UserPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerPolicies();
        $this->registerObservers();
    }

    protected function registerPolicies(): void
    {
        Gate::policy(Page::class, PagePolicy::class);
        Gate::policy(News::class, NewsPolicy::class);
        Gate::policy(Activity::class, ActivityPolicy::class);
        Gate::policy(Document::class, DocumentPolicy::class);
        Gate::policy(Procurement::class, ProcurementPolicy::class);
        Gate::policy(MediaItem::class, MediaPolicy::class);
        Gate::policy(GrmCase::class, GrmPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }

    protected function registerObservers(): void
    {
        Page::observe(AuditObserver::class);
        News::observe(AuditObserver::class);
        Activity::observe(AuditObserver::class);
        Document::observe(AuditObserver::class);
        Procurement::observe(AuditObserver::class);
        GrmCase::observe(AuditObserver::class);
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}

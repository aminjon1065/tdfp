<?php

namespace App\Providers;

use App\Core\Observers\AuditObserver;
use App\Models\Activity;
use App\Models\Document;
use App\Models\GrmCase;
use App\Models\News;
use App\Models\Page;
use App\Models\Procurement;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
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
        $this->registerObservers();
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

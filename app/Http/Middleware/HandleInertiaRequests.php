<?php

namespace App\Http\Middleware;

use App\Models\Page;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $siteSettings = Setting::many([
            'site_title',
            'site_description',
            'contact_email',
            'contact_phone',
            'contact_address',
            'facebook_url',
            'twitter_url',
            'youtube_url',
            'analytics_enabled',
            'analytics_provider',
            'google_analytics_id',
        ], [
            'site_title' => config('app.name'),
            'analytics_enabled' => false,
            'analytics_provider' => 'ga4',
        ]);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => fn () => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'avatar' => $request->user()->avatar,
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'csrf_token' => csrf_token(),
            'localization' => [
                'default_locale' => config('app.locale'),
                'supported_locales' => config('app.supported_locales'),
            ],
            'siteSettings' => [
                ...$siteSettings,
                'analytics_enabled' => filter_var($siteSettings['analytics_enabled'], FILTER_VALIDATE_BOOLEAN),
            ],
            'navigation' => [
                'project_pages' => fn () => Page::query()
                    ->published()
                    ->where('slug', 'like', 'project-%')
                    ->with('translations:page_id,language,title')
                    ->orderByDesc('published_at')
                    ->get(['id', 'slug'])
                    ->map(fn (Page $page) => [
                        'slug' => $page->slug,
                        'href' => route('pages.show', ['slug' => $page->slug], false),
                        'translations' => $page->translations
                            ->map(fn ($translation) => [
                                'language' => $translation->language,
                                'title' => $translation->title,
                            ])
                            ->values(),
                    ])
                    ->values(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => app()->getLocale(),
        ];
    }
}

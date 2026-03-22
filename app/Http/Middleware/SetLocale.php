<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $requestedLocale = $request->query('lang');
        $locale = is_string($requestedLocale) && in_array($requestedLocale, config('app.supported_locales'))
            ? $requestedLocale
            : $request->session()->get('locale', config('app.locale', 'en'));

        if (is_string($requestedLocale) && in_array($requestedLocale, config('app.supported_locales'))) {
            $request->session()->put('locale', $requestedLocale);
        }

        if (! in_array($locale, config('app.supported_locales'))) {
            $locale = config('app.fallback_locale', 'en');
        }

        App::setLocale($locale);

        return $next($request);
    }
}

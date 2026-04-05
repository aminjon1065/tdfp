<?php

namespace App\Core\Services;

use App\ActivityStatus;
use App\Models\Activity;
use App\Models\News;
use App\Models\Page;
use App\Models\Procurement;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PublicSmokeAuditService
{
    /**
     * @return array<int, array{profile: string, url: string, status: int, expected: array<int, int>, ok: bool}>
     */
    public function audit(): array
    {
        $results = [];

        foreach ($this->profiles() as $profile => $userAgent) {
            foreach ($this->urls() as $url) {
                $response = $this->dispatch($url, $userAgent);

                $results[] = [
                    'profile' => $profile,
                    'url' => $url,
                    'status' => $response->getStatusCode(),
                    'expected' => [200],
                    'ok' => $response->getStatusCode() === 200,
                ];
            }
        }

        return $results;
    }

    /**
     * @return array<string, string>
     */
    public function profiles(): array
    {
        return [
            'desktop' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
            'mobile' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
            'bot' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ];
    }

    /**
     * @return array<int, string>
     */
    public function urls(): array
    {
        $urls = [
            route('home'),
            route('about'),
            route('activities.index'),
            route('news.index'),
            route('documents.index'),
            route('procurement.index'),
            route('media.index'),
            route('contact'),
            route('team.index'),
            route('subscriptions.show'),
            route('grm.index'),
            route('grm.submit'),
            route('grm.track'),
            route('search'),
            route('sitemap'),
        ];

        Page::query()
            ->published()
            ->where('slug', '!=', 'about')
            ->pluck('slug')
            ->each(fn (string $slug) => $urls[] = route('pages.show', ['slug' => $slug]));

        Activity::query()
            ->whereIn('status', ActivityStatus::publicValues())
            ->pluck('slug')
            ->each(fn (string $slug) => $urls[] = route('activities.show', ['slug' => $slug]));

        News::query()
            ->where('status', 'published')
            ->pluck('slug')
            ->each(fn (string $slug) => $urls[] = route('news.show', ['slug' => $slug]));

        Procurement::query()
            ->whereIn('status', ['open', 'closed', 'awarded', 'archived'])
            ->pluck('reference_number')
            ->each(fn (string $referenceNumber) => $urls[] = route('procurement.show', ['ref' => $referenceNumber]));

        $urls = array_values(array_unique($urls));
        sort($urls);

        return $urls;
    }

    private function dispatch(string $url, string $userAgent): Response
    {
        $path = parse_url($url, PHP_URL_PATH) ?: '/';
        $query = parse_url($url, PHP_URL_QUERY);
        $requestUri = $query ? sprintf('%s?%s', $path, $query) : $path;

        $request = Request::create($requestUri, 'GET', [], [], [], [
            'HTTP_USER_AGENT' => $userAgent,
            'HTTP_ACCEPT_LANGUAGE' => 'en-US,en;q=0.9',
        ]);

        /** @var Kernel $kernel */
        $kernel = app(Kernel::class);

        $response = $kernel->handle($request);
        $kernel->terminate($request, $response);

        return $response;
    }
}

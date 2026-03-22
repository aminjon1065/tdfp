<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Document;
use App\Models\News;
use App\Models\Page;
use App\Models\Procurement;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = collect([
            $this->makeUrl(route('home'), now()),
            $this->makeUrl(route('about'), $this->pageLastModified('about')),
            $this->makeUrl(route('project'), $this->pageLastModified('project')),
            $this->makeUrl(route('activities.index'), $this->activityLastModified()),
            $this->makeUrl(route('news.index'), $this->newsLastModified()),
            $this->makeUrl(route('documents.index'), $this->documentLastModified()),
            $this->makeUrl(route('procurement.index'), $this->procurementLastModified()),
            $this->makeUrl(route('media.index'), now()),
            $this->makeUrl(route('contact'), now()),
            $this->makeUrl(route('team.index'), now()),
            $this->makeUrl(route('subscriptions.show'), now()),
            $this->makeUrl(route('grm.index'), now()),
            $this->makeUrl(route('grm.submit'), now()),
        ])
            ->merge($this->pageUrls())
            ->merge($this->activityUrls())
            ->merge($this->newsUrls())
            ->merge($this->documentUrls())
            ->merge($this->procurementUrls())
            ->filter();

        $xml = view('sitemap', [
            'urls' => $urls,
        ])->render();

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }

    private function pageUrls(): Collection
    {
        return Page::query()
            ->published()
            ->whereNotIn('slug', ['about', 'project'])
            ->get(['slug', 'updated_at'])
            ->map(fn (Page $page) => $this->makeUrl(route('pages.show', ['slug' => $page->slug]), $page->updated_at));
    }

    private function activityUrls(): Collection
    {
        return Activity::query()
            ->whereIn('status', ['planned', 'in_progress', 'completed'])
            ->get(['slug', 'updated_at'])
            ->map(fn (Activity $activity) => $this->makeUrl(route('activities.show', ['slug' => $activity->slug]), $activity->updated_at));
    }

    private function newsUrls(): Collection
    {
        return News::query()
            ->published()
            ->get(['slug', 'updated_at'])
            ->map(fn (News $news) => $this->makeUrl(route('news.show', ['slug' => $news->slug]), $news->updated_at));
    }

    private function procurementUrls(): Collection
    {
        return Procurement::query()
            ->whereIn('status', ['open', 'closed', 'awarded', 'archived'])
            ->get(['reference_number', 'updated_at'])
            ->map(fn (Procurement $procurement) => $this->makeUrl(route('procurement.show', ['ref' => $procurement->reference_number]), $procurement->updated_at));
    }

    private function documentUrls(): Collection
    {
        return Document::query()
            ->whereNotNull('published_at')
            ->whereNotNull('file_path')
            ->get(['id', 'updated_at'])
            ->map(fn (Document $document) => $this->makeUrl(route('documents.download', ['document' => $document]), $document->updated_at));
    }

    private function makeUrl(string $location, $lastModified): array
    {
        return [
            'location' => $location,
            'last_modified' => optional($lastModified)->toAtomString(),
        ];
    }

    private function pageLastModified(string $slug): mixed
    {
        return Page::query()
            ->published()
            ->where('slug', $slug)
            ->value('updated_at');
    }

    private function activityLastModified(): mixed
    {
        return Activity::query()
            ->whereIn('status', ['planned', 'in_progress', 'completed'])
            ->latest('updated_at')
            ->value('updated_at');
    }

    private function newsLastModified(): mixed
    {
        return News::query()
            ->published()
            ->latest('updated_at')
            ->value('updated_at');
    }

    private function documentLastModified(): mixed
    {
        return Document::query()
            ->whereNotNull('published_at')
            ->latest('updated_at')
            ->value('updated_at');
    }

    private function procurementLastModified(): mixed
    {
        return Procurement::query()
            ->whereIn('status', ['open', 'closed', 'awarded', 'archived'])
            ->latest('updated_at')
            ->value('updated_at');
    }
}

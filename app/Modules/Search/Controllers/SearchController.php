<?php

namespace App\Modules\Search\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SearchIndex;
use App\Modules\Search\Services\SearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function __construct(private SearchService $service) {}

    public function index(Request $request): Response
    {
        $language = $request->string('lang')->value() ?: app()->getLocale();
        $results = null;
        $query = $request->string('q')->trim()->value();

        if ($query !== '') {
            $results = $this->service->search(
                $query,
                $language,
                $request->only('entity_type')
            )->through(fn (SearchIndex $searchIndex) => $this->serializeResult($searchIndex, $query));
        }

        return Inertia::render('public/search', [
            'results' => $results,
            'query' => $query,
            'filters' => [
                ...$request->only('entity_type'),
                'lang' => $language,
            ],
            'entityTypes' => $this->service->availableEntityTypes($language, $query !== '' ? $query : null),
        ]);
    }

    private function serializeResult(SearchIndex $searchIndex, string $query): array
    {
        return [
            'id' => $searchIndex->id,
            'entity_type' => $searchIndex->entity_type,
            'entity_label_key' => $this->service->entityTypeLabelKey($searchIndex->entity_type),
            'title' => $searchIndex->title,
            'snippet' => $this->buildSnippet($searchIndex->content, $query),
            'url' => $searchIndex->url,
        ];
    }

    private function buildSnippet(?string $content, string $query): ?string
    {
        if ($content === null || trim($content) === '') {
            return null;
        }

        $plainText = trim(strip_tags($content));

        if ($plainText === '') {
            return null;
        }

        $position = mb_stripos($plainText, $query);
        if ($position === false) {
            return Str::limit($plainText, 180);
        }

        $start = max($position - 60, 0);
        $snippet = mb_substr($plainText, $start, 180);

        return ($start > 0 ? '…' : '').Str::finish(trim($snippet), '…');
    }
}

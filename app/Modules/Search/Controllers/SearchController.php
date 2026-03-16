<?php
namespace App\Modules\Search\Controllers;
use App\Http\Controllers\Controller;
use App\Modules\Search\Services\SearchService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function __construct(private SearchService $service) {}

    public function index(Request $request): Response
    {
        $results = null;
        if ($request->filled('q')) {
            $results = $this->service->search(
                $request->q,
                $request->get('lang', 'en'),
                $request->only('entity_type')
            );
        }

        return Inertia::render('public/search', [
            'results' => $results,
            'query' => $request->q,
            'filters' => $request->only('entity_type', 'lang'),
        ]);
    }
}

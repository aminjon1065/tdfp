<?php
namespace App\Modules\News\Controllers;
use App\Http\Controllers\Controller;
use App\Models\NewsCategory;
use App\Modules\News\Repositories\NewsRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicNewsController extends Controller
{
    public function __construct(private NewsRepository $repository) {}

    public function index(Request $request): Response
    {
        return Inertia::render('public/news/index', [
            'news' => $this->repository->paginateWithTranslations(12, array_merge($request->only('category_id', 'search'), ['status' => 'published'])),
            'categories' => NewsCategory::all(),
            'filters' => $request->only('category_id', 'search'),
        ]);
    }

    public function show(string $slug): Response
    {
        $news = $this->repository->findPublishedBySlug($slug);
        abort_if(!$news, 404);
        $latest = $this->repository->latestPublished(4);
        return Inertia::render('public/news/show', ['news' => $news, 'latest' => $latest]);
    }
}

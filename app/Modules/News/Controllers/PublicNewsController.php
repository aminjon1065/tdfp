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
            'news' => $this->repository->paginatePublishedWithTranslations(12, $request->only('category_id', 'search')),
            'featuredAnnouncements' => $this->repository->featuredAnnouncements(3),
            'categories' => NewsCategory::all(),
            'filters' => $request->only('category_id', 'search'),
            'recentWindowDays' => $this->repository->recentWindowDays(),
        ]);
    }

    public function show(string $slug): Response
    {
        $news = $this->repository->findPublishedBySlug($slug);
        abort_if(! $news, 404);
        $latest = $this->repository->latestPublished(4);

        return Inertia::render('public/news/show', ['news' => $news, 'latest' => $latest]);
    }
}

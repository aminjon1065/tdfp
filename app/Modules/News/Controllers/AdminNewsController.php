<?php

namespace App\Modules\News\Controllers;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\NewsCategory;
use App\Modules\News\Repositories\NewsRepository;
use App\Modules\News\Requests\StoreNewsRequest;
use App\Modules\News\Requests\UpdateNewsRequest;
use App\Modules\News\Services\NewsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminNewsController extends Controller
{
    public function __construct(
        private NewsRepository $repository,
        private NewsService $service
    ) {
        $this->authorizeResource(News::class, 'news');
    }

    public function index(Request $request): Response
    {
        return Inertia::render('admin/news/index', [
            'news' => $this->repository->paginateWithTranslations(15, $request->only('status', 'category_id', 'search')),
            'categories' => NewsCategory::all(),
            'filters' => $request->only('status', 'category_id', 'search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/news/create', [
            'categories' => NewsCategory::all(),
        ]);
    }

    public function store(StoreNewsRequest $request): RedirectResponse
    {
        $this->service->store($request->validated());

        return redirect()->route('admin.news.index')->with('success', 'News article created.');
    }

    public function edit(News $news): Response
    {
        $news->load('translations', 'category');

        return Inertia::render('admin/news/edit', [
            'news' => $news,
            'categories' => NewsCategory::all(),
        ]);
    }

    public function update(UpdateNewsRequest $request, News $news): RedirectResponse
    {
        $this->service->update($news, $request->validated());

        return redirect()->route('admin.news.index')->with('success', 'News article updated.');
    }

    public function destroy(News $news): RedirectResponse
    {
        $this->service->delete($news);

        return redirect()->route('admin.news.index')->with('success', 'News article deleted.');
    }
}

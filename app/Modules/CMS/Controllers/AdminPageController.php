<?php
namespace App\Modules\CMS\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Modules\CMS\Repositories\PageRepository;
use App\Modules\CMS\Requests\StorePageRequest;
use App\Modules\CMS\Requests\UpdatePageRequest;
use App\Modules\CMS\Services\PageService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminPageController extends Controller
{
    public function __construct(
        private PageRepository $repository,
        private PageService $service
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/pages/index', [
            'pages' => $this->repository->paginateWithTranslations(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/pages/create');
    }

    public function store(StorePageRequest $request): RedirectResponse
    {
        $this->service->store($request->validated());
        return redirect()->route('admin.pages.index')->with('success', 'Page created.');
    }

    public function edit(Page $page): Response
    {
        $page->load('translations');
        return Inertia::render('admin/pages/edit', ['page' => $page]);
    }

    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        $this->service->update($page, $request->validated());
        return redirect()->route('admin.pages.index')->with('success', 'Page updated.');
    }

    public function destroy(Page $page): RedirectResponse
    {
        $this->service->delete($page);
        return redirect()->route('admin.pages.index')->with('success', 'Page deleted.');
    }
}

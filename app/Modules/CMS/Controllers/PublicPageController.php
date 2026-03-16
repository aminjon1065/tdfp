<?php
namespace App\Modules\CMS\Controllers;
use App\Http\Controllers\Controller;
use App\Modules\CMS\Repositories\PageRepository;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    public function __construct(private PageRepository $repository) {}

    public function show(string $slug): Response
    {
        $page = $this->repository->findPublishedBySlug($slug);
        abort_if(!$page, 404);
        return Inertia::render('public/page', ['page' => $page]);
    }
}

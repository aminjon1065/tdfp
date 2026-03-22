<?php

namespace App\Modules\Activities\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Activities\Repositories\ActivityRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicActivityController extends Controller
{
    public function __construct(private ActivityRepository $repository) {}

    public function index(Request $request): Response
    {
        $filters = $request->only('status', 'lang');

        return Inertia::render('public/activities/index', [
            'activities' => $this->repository->paginatePublicWithTranslations(12, $filters),
            'filters' => $filters,
        ]);
    }

    public function show(string $slug): Response
    {
        $activity = $this->repository->findPublishedBySlug($slug);
        abort_if(! $activity, 404);

        return Inertia::render('public/activities/show', ['activity' => $activity]);
    }
}

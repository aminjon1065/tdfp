<?php
namespace App\Modules\Activities\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Modules\Activities\Repositories\ActivityRepository;
use App\Modules\Activities\Requests\StoreActivityRequest;
use App\Modules\Activities\Requests\UpdateActivityRequest;
use App\Modules\Activities\Services\ActivityService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminActivityController extends Controller
{
    public function __construct(
        private ActivityRepository $repository,
        private ActivityService $service
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/activities/index', [
            'activities' => $this->repository->paginateWithTranslations(15, $request->only('status')),
            'filters' => $request->only('status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/activities/create');
    }

    public function store(StoreActivityRequest $request): RedirectResponse
    {
        $this->service->store($request->validated());
        return redirect()->route('admin.activities.index')->with('success', 'Activity created.');
    }

    public function edit(Activity $activity): Response
    {
        $activity->load('translations');
        return Inertia::render('admin/activities/edit', ['activity' => $activity]);
    }

    public function update(UpdateActivityRequest $request, Activity $activity): RedirectResponse
    {
        $this->service->update($activity, $request->validated());
        return redirect()->route('admin.activities.index')->with('success', 'Activity updated.');
    }

    public function destroy(Activity $activity): RedirectResponse
    {
        $this->service->delete($activity);
        return redirect()->route('admin.activities.index')->with('success', 'Activity deleted.');
    }
}

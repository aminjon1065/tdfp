<?php

namespace App\Modules\GRM\Controllers;

use App\Http\Controllers\Controller;
use App\Models\GrmCase;
use App\Models\User;
use App\Modules\GRM\Repositories\GrmRepository;
use App\Modules\GRM\Requests\AddGrmMessageRequest;
use App\Modules\GRM\Requests\UpdateGrmStatusRequest;
use App\Modules\GRM\Services\GrmService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminGrmController extends Controller
{
    public function __construct(
        private GrmRepository $repository,
        private GrmService $service
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', GrmCase::class);

        return Inertia::render('admin/grm/index', [
            'cases' => $this->repository->paginateWithRelations(15, $request->only('status', 'category', 'search')),
            'filters' => $request->only('status', 'category', 'search'),
        ]);
    }

    public function show(GrmCase $grmCase): Response
    {
        $this->authorize('view', $grmCase);

        $grmCase->load('messages.officer', 'attachments', 'statusHistory.changedBy', 'assignee');
        $officers = User::role('grm_officer')->get(['id', 'name']);

        return Inertia::render('admin/grm/show', ['case' => $grmCase, 'officers' => $officers]);
    }

    public function updateStatus(UpdateGrmStatusRequest $request, GrmCase $grmCase): RedirectResponse
    {
        $this->authorize('updateStatus', $grmCase);

        $validated = $request->validated();

        $this->service->updateStatus($grmCase, $validated['status'], $validated['officer_id'] ?? null, $validated['notes'] ?? null);

        return back()->with('success', 'Status updated.');
    }

    public function addMessage(AddGrmMessageRequest $request, GrmCase $grmCase): RedirectResponse
    {
        $this->authorize('message', $grmCase);

        $this->service->addMessage($grmCase, $request->validated('message'));

        return back()->with('success', 'Message sent.');
    }
}

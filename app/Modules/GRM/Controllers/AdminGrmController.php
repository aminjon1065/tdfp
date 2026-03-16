<?php
namespace App\Modules\GRM\Controllers;
use App\Http\Controllers\Controller;
use App\Models\GrmCase;
use App\Models\User;
use App\Modules\GRM\Repositories\GrmRepository;
use App\Modules\GRM\Services\GrmService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
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
        return Inertia::render('admin/grm/index', [
            'cases' => $this->repository->paginateWithRelations(15, $request->only('status', 'category', 'search')),
            'filters' => $request->only('status', 'category', 'search'),
        ]);
    }

    public function show(GrmCase $grmCase): Response
    {
        $grmCase->load('messages.officer', 'attachments', 'statusHistory.changedBy', 'assignee');
        $officers = User::role('grm_officer')->get(['id', 'name']);
        return Inertia::render('admin/grm/show', ['case' => $grmCase, 'officers' => $officers]);
    }

    public function updateStatus(Request $request, GrmCase $grmCase): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:submitted,under_review,investigation,resolved,closed',
            'officer_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        $this->service->updateStatus($grmCase, $request->status, $request->officer_id, $request->notes);
        return back()->with('success', 'Status updated.');
    }

    public function addMessage(Request $request, GrmCase $grmCase): RedirectResponse
    {
        $request->validate(['message' => 'required|string|max:2000']);
        $this->service->addMessage($grmCase, $request->message);
        return back()->with('success', 'Message sent.');
    }
}

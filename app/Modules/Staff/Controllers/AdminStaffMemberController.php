<?php

namespace App\Modules\Staff\Controllers;

use App\Http\Controllers\Controller;
use App\Models\StaffMember;
use App\Modules\Staff\Repositories\StaffRepository;
use App\Modules\Staff\Requests\StoreStaffMemberRequest;
use App\Modules\Staff\Requests\UpdateStaffMemberRequest;
use App\Modules\Staff\Services\StaffService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminStaffMemberController extends Controller
{
    public function __construct(
        private StaffRepository $repository,
        private StaffService $service,
    ) {
        $this->authorizeResource(StaffMember::class, 'staff_member');
    }

    public function index(Request $request): Response
    {
        return Inertia::render('admin/staff-members/index', [
            'staffMembers' => $this->repository->paginateWithRelations(15, $request->only('search')),
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/staff-members/create', [
            'parentOptions' => $this->repository->parentOptions()->values(),
        ]);
    }

    public function store(StoreStaffMemberRequest $request): RedirectResponse
    {
        $this->service->store($request->validated());

        return redirect()->route('admin.staff-members.index')->with('success', 'Staff member created.');
    }

    public function edit(StaffMember $staffMember): Response
    {
        $staffMember->load(['translations', 'parent.translations']);

        return Inertia::render('admin/staff-members/edit', [
            'staffMember' => $staffMember,
            'parentOptions' => $this->repository->parentOptions($staffMember->id)->values(),
        ]);
    }

    public function update(UpdateStaffMemberRequest $request, StaffMember $staffMember): RedirectResponse
    {
        $this->service->update($staffMember, $request->validated());

        return redirect()->route('admin.staff-members.index')->with('success', 'Staff member updated.');
    }

    public function destroy(StaffMember $staffMember): RedirectResponse
    {
        $this->service->delete($staffMember);

        return redirect()->route('admin.staff-members.index')->with('success', 'Staff member deleted.');
    }
}

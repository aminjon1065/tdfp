<?php

namespace App\Modules\Procurement\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Procurement;
use App\Modules\Procurement\Repositories\ProcurementRepository;
use App\Modules\Procurement\Requests\StoreProcurementRequest;
use App\Modules\Procurement\Requests\UpdateProcurementRequest;
use App\Modules\Procurement\Services\ProcurementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminProcurementController extends Controller
{
    public function __construct(
        private ProcurementRepository $repository,
        private ProcurementService $service
    ) {
        $this->authorizeResource(Procurement::class, 'procurement');
    }

    public function index(Request $request): Response
    {
        return Inertia::render('admin/procurement/index', [
            'procurements' => $this->repository->paginateWithRelations(15, $request->only('status', 'search')),
            'filters' => $request->only('status', 'search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/procurement/create');
    }

    public function store(StoreProcurementRequest $request): RedirectResponse
    {
        $this->service->store($request->validated());

        return redirect()->route('admin.procurement.index')->with('success', 'Procurement notice created.');
    }

    public function edit(Procurement $procurement): Response
    {
        $procurement->load('translations', 'documents');

        return Inertia::render('admin/procurement/edit', ['procurement' => $procurement]);
    }

    public function update(UpdateProcurementRequest $request, Procurement $procurement): RedirectResponse
    {
        $this->service->update($procurement, $request->validated());

        return redirect()->route('admin.procurement.index')->with('success', 'Procurement updated.');
    }

    public function destroy(Procurement $procurement): RedirectResponse
    {
        $this->service->delete($procurement);

        return redirect()->route('admin.procurement.index')->with('success', 'Procurement deleted.');
    }
}

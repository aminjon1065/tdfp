<?php
namespace App\Modules\Procurement\Controllers;
use App\Http\Controllers\Controller;
use App\Modules\Procurement\Repositories\ProcurementRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicProcurementController extends Controller
{
    public function __construct(private ProcurementRepository $repository) {}

    public function index(Request $request): Response
    {
        return Inertia::render('public/procurement/index', [
            'procurements' => $this->repository->paginateWithRelations(15, $request->only('status', 'search')),
            'filters' => $request->only('status', 'search'),
        ]);
    }

    public function show(string $ref): Response
    {
        $procurement = $this->repository->findByRefOrId($ref);
        abort_if(!$procurement, 404);
        return Inertia::render('public/procurement/show', ['procurement' => $procurement]);
    }
}

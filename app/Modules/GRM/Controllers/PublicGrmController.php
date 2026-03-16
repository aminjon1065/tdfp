<?php
namespace App\Modules\GRM\Controllers;
use App\Http\Controllers\Controller;
use App\Modules\GRM\Repositories\GrmRepository;
use App\Modules\GRM\Requests\SubmitGrmRequest;
use App\Modules\GRM\Services\GrmService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PublicGrmController extends Controller
{
    public function __construct(
        private GrmRepository $repository,
        private GrmService $service
    ) {}

    public function index(): Response
    {
        return Inertia::render('public/grm/index');
    }

    public function submit(): Response
    {
        return Inertia::render('public/grm/submit');
    }

    public function store(SubmitGrmRequest $request): RedirectResponse
    {
        $case = $this->service->submit($request->validated());
        return redirect()->route('grm.submitted', ['ticket' => $case->ticket_number]);
    }

    public function submitted(string $ticket): Response
    {
        return Inertia::render('public/grm/submitted', ['ticket' => $ticket]);
    }

    public function track(): Response
    {
        return Inertia::render('public/grm/track');
    }

    public function trackSearch(Request $request): Response
    {
        $request->validate(['ticket_number' => 'required|string']);
        $case = $this->repository->findByTicket($request->ticket_number);

        return Inertia::render('public/grm/track', [
            'case' => $case ? [
                'ticket_number' => $case->ticket_number,
                'status' => $case->status,
                'category' => $case->category,
                'created_at' => $case->created_at,
                'statusHistory' => $case->statusHistory->map(fn($h) => [
                    'status' => $h->status,
                    'notes' => $h->notes,
                    'created_at' => $h->created_at,
                ]),
            ] : null,
            'notFound' => !$case,
        ]);
    }
}

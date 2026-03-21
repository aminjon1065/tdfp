<?php

namespace App\Modules\GRM\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\GRM\Repositories\GrmRepository;
use App\Modules\GRM\Requests\SubmitGrmRequest;
use App\Modules\GRM\Services\GrmService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        return redirect()->route('grm.submitted', [
            'ticket' => $case->ticket_number,
            'token' => $case->tracking_token,
        ]);
    }

    public function submitted(string $ticket): Response
    {
        abort_unless(request()->filled('token'), 404);

        return Inertia::render('public/grm/submitted', [
            'ticket' => $ticket,
            'trackingToken' => request()->string('token')->value(),
        ]);
    }

    public function track(): Response
    {
        return Inertia::render('public/grm/track');
    }

    public function trackSearch(Request $request): Response
    {
        $validated = $request->validate([
            'ticket_number' => ['required', 'string', 'regex:/^GRM-\d{4}-\d{5}$/'],
            'tracking_token' => ['required', 'string', 'size:32'],
        ]);
        $case = $this->repository->findForTracking(
            strtoupper($validated['ticket_number']),
            strtoupper($validated['tracking_token']),
        );
        $trackingExpired = $case?->hasExpiredPublicTracking() ?? false;

        return Inertia::render('public/grm/track', [
            'case' => $case && ! $trackingExpired ? [
                'ticket_number' => $case->ticket_number,
                'status' => $case->status,
                'created_at' => $case->created_at,
                'statusHistory' => $case->statusHistory->map(fn ($h) => [
                    'status' => $h->status,
                    'created_at' => $h->created_at,
                ]),
            ] : null,
            'notFound' => ! $case,
            'trackingExpired' => $trackingExpired,
        ]);
    }
}

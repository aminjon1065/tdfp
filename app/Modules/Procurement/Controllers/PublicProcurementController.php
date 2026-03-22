<?php

namespace App\Modules\Procurement\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Procurement;
use App\Modules\Procurement\Repositories\ProcurementRepository;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicProcurementController extends Controller
{
    public function __construct(private ProcurementRepository $repository) {}

    public function index(Request $request): Response
    {
        $filters = $request->only('search', 'status', 'year', 'lang');

        return Inertia::render('public/procurement/index', [
            'procurements' => $this->repository
                ->paginatePublicWithRelations(15, $filters)
                ->through(fn (Procurement $procurement) => $this->serializePublicProcurement($procurement)),
            'filters' => $filters,
            'years' => $this->repository->publicArchiveYears(),
        ]);
    }

    public function show(string $ref): Response
    {
        $procurement = $this->repository->findPublicByRef($ref);
        abort_if(! $procurement, 404);

        return Inertia::render('public/procurement/show', [
            'procurement' => $this->serializePublicProcurement($procurement, true),
        ]);
    }

    private function serializePublicProcurement(Procurement $procurement, bool $includeDocuments = false): array
    {
        $today = CarbonImmutable::today();
        $deadline = $procurement->deadline ? CarbonImmutable::parse($procurement->deadline) : null;
        $publicationDate = $procurement->publication_date
            ? CarbonImmutable::parse($procurement->publication_date)
            : null;
        $processState = $this->determineProcessState($procurement, $today, $deadline);
        $isSubmissionOpen = $processState === 'submission_open';
        $deadlinePassed = $deadline?->isPast() ?? false;

        return [
            'id' => $procurement->id,
            'reference_number' => $procurement->reference_number,
            'status' => $procurement->status,
            'publication_date' => $procurement->publication_date,
            'deadline' => $procurement->deadline,
            'translations' => $procurement->translations,
            'process_state' => $processState,
            'process_summary_key' => $this->summaryKeyForProcessState($processState),
            'is_submission_open' => $isSubmissionOpen,
            'deadline_passed' => $deadlinePassed,
            'days_until_deadline' => $deadline && ! $deadlinePassed
                ? $today->diffInDays($deadline, false)
                : null,
            'days_since_publication' => $publicationDate
                ? $publicationDate->diffInDays($today, false)
                : null,
            'documents_count' => $includeDocuments ? $procurement->documents->count() : null,
            'documents' => $includeDocuments ? $procurement->documents : null,
        ];
    }

    private function determineProcessState(Procurement $procurement, CarbonImmutable $today, ?CarbonImmutable $deadline): string
    {
        return match ($procurement->status) {
            'open' => $deadline && $deadline->lt($today)
                ? 'deadline_passed'
                : 'submission_open',
            'closed' => 'under_evaluation',
            'awarded' => 'contract_awarded',
            'archived' => 'archived',
            default => 'archived',
        };
    }

    private function summaryKeyForProcessState(string $processState): string
    {
        return match ($processState) {
            'submission_open' => 'procurement.processSummaryOpen',
            'deadline_passed' => 'procurement.processSummaryDeadlinePassed',
            'under_evaluation' => 'procurement.processSummaryUnderEvaluation',
            'contract_awarded' => 'procurement.processSummaryAwarded',
            default => 'procurement.processSummaryArchived',
        };
    }
}

<?php

namespace App\Modules\GRM\Controllers;

use App\Http\Controllers\Controller;
use App\Models\GrmAttachment;
use App\Models\GrmCase;
use App\Models\User;
use App\Modules\GRM\Repositories\GrmRepository;
use App\Modules\GRM\Requests\AddGrmMessageRequest;
use App\Modules\GRM\Requests\UpdateGrmStatusRequest;
use App\Modules\GRM\Services\GrmService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
            'cases' => $this->repository
                ->paginateWithRelations(15, $request->only('status', 'category', 'search'))
                ->through(fn (GrmCase $grmCase) => $this->serializeCaseForIndex($grmCase)),
            'filters' => $request->only('status', 'category', 'search'),
        ]);
    }

    public function show(GrmCase $grmCase): Response
    {
        $this->authorize('view', $grmCase);

        $grmCase->load('messages.officer', 'attachments', 'statusHistory.changedBy', 'assignee');
        $officers = User::role('grm_officer')->get(['id', 'name']);

        return Inertia::render('admin/grm/show', [
            'case' => $this->serializeCaseForShow($grmCase, request()->user()),
            'officers' => $officers,
        ]);
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

    public function downloadAttachment(GrmCase $grmCase, GrmAttachment $attachment): StreamedResponse
    {
        $this->authorize('viewSensitiveData', $grmCase);

        abort_unless($attachment->case_id === $grmCase->id, 404);
        abort_unless(Storage::disk('local')->exists($attachment->file_path), 404);

        return Storage::disk('local')->download(
            $attachment->file_path,
            $attachment->original_name ?? basename($attachment->file_path),
        );
    }

    private function serializeCaseForIndex(GrmCase $grmCase): array
    {
        return [
            'id' => $grmCase->id,
            'ticket_number' => $grmCase->ticket_number,
            'complainant_name' => $this->maskName($grmCase->complainant_name),
            'category' => $grmCase->category,
            'status' => $grmCase->status,
            'created_at' => $grmCase->created_at,
        ];
    }

    private function serializeCaseForShow(GrmCase $grmCase, User $user): array
    {
        $canViewSensitiveData = $user->can('viewSensitiveData', $grmCase);

        return [
            'id' => $grmCase->id,
            'ticket_number' => $grmCase->ticket_number,
            'complainant_name' => $canViewSensitiveData
                ? $grmCase->complainant_name
                : $this->maskName($grmCase->complainant_name),
            'complainant_email' => $canViewSensitiveData
                ? $grmCase->email
                : $this->maskEmail($grmCase->email),
            'complainant_phone' => $canViewSensitiveData
                ? $grmCase->phone
                : $this->maskPhone($grmCase->phone),
            'category' => $grmCase->category,
            'description' => $grmCase->description,
            'status' => $grmCase->status,
            'assigned_officer_id' => $grmCase->assigned_to,
            'assigned_officer' => $grmCase->assignee?->name,
            'created_at' => $grmCase->created_at,
            'can_view_sensitive_data' => $canViewSensitiveData,
            'can_update_status' => $user->can('updateStatus', $grmCase),
            'can_message' => $user->can('message', $grmCase),
            'attachments' => $canViewSensitiveData
                ? $grmCase->attachments->map(fn (GrmAttachment $attachment) => [
                    'id' => $attachment->id,
                    'original_name' => $attachment->original_name,
                    'uploaded_at' => $attachment->uploaded_at,
                ])->values()->all()
                : [],
            'messages' => $grmCase->messages->map(fn ($message) => [
                'id' => $message->id,
                'sender_type' => $message->sender_type,
                'sender_name' => $message->sender_type === 'officer'
                    ? ($message->officer?->name ?? 'Officer')
                    : 'Complainant',
                'message' => $message->message,
                'created_at' => $message->created_at,
            ])->values()->all(),
            'status_history' => $grmCase->statusHistory->map(fn ($entry) => [
                'id' => $entry->id,
                'from_status' => null,
                'to_status' => $entry->status,
                'notes' => $entry->notes,
                'changed_by' => $entry->changedBy?->name ?? 'System',
                'created_at' => $entry->created_at,
            ])->values()->all(),
        ];
    }

    private function maskName(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return $value;
        }

        return collect(preg_split('/\s+/', trim($value)) ?: [])
            ->filter()
            ->map(function (string $segment): string {
                return mb_substr($segment, 0, 1).str_repeat('*', max(mb_strlen($segment) - 1, 2));
            })
            ->implode(' ');
    }

    private function maskEmail(?string $value): ?string
    {
        if ($value === null || $value === '' || ! str_contains($value, '@')) {
            return $value;
        }

        [$localPart, $domain] = explode('@', $value, 2);

        return mb_substr($localPart, 0, min(2, mb_strlen($localPart))).'***@'.$domain;
    }

    private function maskPhone(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return $value;
        }

        $visibleDigits = mb_substr($value, -2);
        $maskedLength = max(mb_strlen($value) - 2, 4);

        return str_repeat('*', $maskedLength).$visibleDigits;
    }
}

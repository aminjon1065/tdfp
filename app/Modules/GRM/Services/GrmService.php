<?php

namespace App\Modules\GRM\Services;

use App\Core\Helpers\FileHelper;
use App\Mail\GrmSubmittedMail;
use App\Models\AuditLog;
use App\Models\GrmAttachment;
use App\Models\GrmCase;
use App\Models\GrmMessage;
use App\Models\GrmStatusHistory;
use App\Models\User;
use App\Modules\GRM\Repositories\GrmRepository;
use Carbon\CarbonInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class GrmService
{
    public function __construct(private GrmRepository $repository) {}

    public function submit(array $data): GrmCase
    {
        return DB::transaction(function () use ($data) {
            $year = date('Y');
            $lastCase = GrmCase::whereYear('created_at', $year)
                ->lockForUpdate()
                ->orderByDesc('id')
                ->first();
            $sequence = $lastCase ? ((int) substr($lastCase->ticket_number, -5)) + 1 : 1;
            $ticketNumber = 'GRM-'.$year.'-'.str_pad($sequence, 5, '0', STR_PAD_LEFT);

            $case = GrmCase::create([
                'ticket_number' => $ticketNumber,
                'tracking_token' => Str::upper(Str::random(32)),
                'complainant_name' => $data['complainant_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'category' => $data['category'],
                'description' => $data['description'],
                'status' => 'submitted',
            ]);

            GrmStatusHistory::create([
                'case_id' => $case->id,
                'status' => 'submitted',
                'changed_by' => null,
                'notes' => 'Case submitted by complainant.',
            ]);

            if (! empty($data['attachments'])) {
                foreach ($data['attachments'] as $file) {
                    if ($file instanceof UploadedFile) {
                        GrmAttachment::create([
                            'case_id' => $case->id,
                            'file_path' => FileHelper::store($file, 'grm', 'local'),
                            'original_name' => $file->getClientOriginalName(),
                            'uploaded_at' => now(),
                        ]);
                    }
                }
            }

            try {
                Mail::to($case->email)->queue(
                    (new GrmSubmittedMail($case))->afterCommit()
                );
            } catch (\Exception $e) {
                Log::error('GRM email queueing failed: '.$e->getMessage());
            }

            return $case;
        });
    }

    public function updateStatus(GrmCase $case, string $status, ?int $officerId, ?string $notes): GrmCase
    {
        return DB::transaction(function () use ($case, $status, $officerId, $notes) {
            if ($officerId !== null && ! User::role('grm_officer')->whereKey($officerId)->exists()) {
                abort(422, 'The selected officer is invalid.');
            }

            $originalStatus = $case->status;
            $originalAssignee = $case->assigned_to;
            $closedAt = $status === 'closed' ? ($case->closed_at ?? now()) : null;
            $trackingExpiry = $this->resolvePublicTrackingExpiry($status, $closedAt);

            $case->update([
                'status' => $status,
                'assigned_to' => $officerId ?? $case->assigned_to,
                'closed_at' => $closedAt,
                'public_tracking_expires_at' => $trackingExpiry,
            ]);

            GrmStatusHistory::create([
                'case_id' => $case->id,
                'status' => $status,
                'changed_by' => auth()->id(),
                'notes' => $notes,
            ]);

            $this->logAudit(
                'grm.status_updated',
                $case,
                [
                    'from_status' => $originalStatus,
                    'to_status' => $status,
                    'assigned_to_before' => $originalAssignee,
                    'assigned_to_after' => $case->assigned_to,
                    'notes_present' => filled($notes),
                    'closed_at' => $case->closed_at?->toIso8601String(),
                    'public_tracking_expires_at' => $case->public_tracking_expires_at?->toIso8601String(),
                ],
            );

            if ($originalAssignee !== $case->assigned_to) {
                $this->logAudit(
                    'grm.assigned',
                    $case,
                    [
                        'assigned_to_before' => $originalAssignee,
                        'assigned_to_after' => $case->assigned_to,
                    ],
                );
            }

            return $case->fresh();
        });
    }

    public function addMessage(GrmCase $case, string $message): GrmMessage
    {
        $grmMessage = GrmMessage::create([
            'case_id' => $case->id,
            'sender_type' => 'officer',
            'officer_id' => auth()->id(),
            'message' => $message,
        ]);

        $this->logAudit(
            'grm.message_added',
            $case,
            [
                'message_id' => $grmMessage->id,
                'sender_type' => 'officer',
                'message_length' => mb_strlen($message),
            ],
        );

        return $grmMessage;
    }

    private function logAudit(string $action, GrmCase $case, array $metadata): void
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'entity_type' => $case::class,
            'entity_id' => $case->getKey(),
            'metadata' => array_merge([
                'ticket_number' => $case->ticket_number,
            ], $metadata),
            'ip_address' => request()?->ip(),
            'created_at' => now(),
        ]);
    }

    private function resolvePublicTrackingExpiry(string $status, ?CarbonInterface $closedAt): ?CarbonInterface
    {
        if ($status !== 'closed') {
            return null;
        }

        return $closedAt?->addDays(config('grm.public_tracking_retention_days'));
    }
}

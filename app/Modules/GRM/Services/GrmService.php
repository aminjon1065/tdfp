<?php

namespace App\Modules\GRM\Services;

use App\Core\Helpers\FileHelper;
use App\Mail\GrmSubmittedMail;
use App\Models\GrmAttachment;
use App\Models\GrmCase;
use App\Models\GrmMessage;
use App\Models\GrmStatusHistory;
use App\Modules\GRM\Repositories\GrmRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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
                            'file_path' => FileHelper::store($file, 'grm'),
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
            $case->update([
                'status' => $status,
                'assigned_to' => $officerId ?? $case->assigned_to,
            ]);

            GrmStatusHistory::create([
                'case_id' => $case->id,
                'status' => $status,
                'changed_by' => auth()->id(),
                'notes' => $notes,
            ]);

            return $case->fresh();
        });
    }

    public function addMessage(GrmCase $case, string $message): GrmMessage
    {
        return GrmMessage::create([
            'case_id' => $case->id,
            'sender_type' => 'officer',
            'officer_id' => auth()->id(),
            'message' => $message,
        ]);
    }
}

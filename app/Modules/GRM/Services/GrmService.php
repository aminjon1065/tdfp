<?php
namespace App\Modules\GRM\Services;
use App\Core\Helpers\FileHelper;
use App\Models\GrmAttachment;
use App\Models\GrmCase;
use App\Models\GrmMessage;
use App\Models\GrmStatusHistory;
use App\Modules\GRM\Repositories\GrmRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class GrmService
{
    public function __construct(private GrmRepository $repository) {}

    public function submit(array $data): GrmCase
    {
        return DB::transaction(function () use ($data) {
            $ticketNumber = 'GRM-' . date('Y') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT);
            while (GrmCase::where('ticket_number', $ticketNumber)->exists()) {
                $ticketNumber = 'GRM-' . date('Y') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT);
            }

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

            if (!empty($data['attachments'])) {
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

            // Send confirmation email
            try {
                Mail::to($case->email)->send(new \App\Mail\GrmSubmittedMail($case));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('GRM email failed: ' . $e->getMessage());
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

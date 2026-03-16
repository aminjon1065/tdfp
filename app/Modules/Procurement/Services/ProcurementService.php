<?php
namespace App\Modules\Procurement\Services;
use App\Models\Procurement;
use App\Models\ProcurementTranslation;
use App\Modules\Procurement\Repositories\ProcurementRepository;
use Illuminate\Support\Facades\DB;

class ProcurementService
{
    public function __construct(private ProcurementRepository $repository) {}

    public function store(array $data): Procurement
    {
        return DB::transaction(function () use ($data) {
            $procurement = $this->repository->create([
                'reference_number' => $data['reference_number'],
                'status' => $data['status'] ?? 'open',
                'publication_date' => $data['publication_date'] ?? now()->toDateString(),
                'deadline' => $data['deadline'] ?? null,
                'created_by' => auth()->id(),
            ]);

            foreach ($data['translations'] as $lang => $translation) {
                ProcurementTranslation::create([
                    'procurement_id' => $procurement->id,
                    'language' => $lang,
                    'title' => $translation['title'] ?? '',
                    'description' => $translation['description'] ?? null,
                ]);
            }

            if (!empty($data['document_ids'])) {
                $procurement->documents()->sync($data['document_ids']);
            }

            return $procurement;
        });
    }

    public function update(Procurement $procurement, array $data): Procurement
    {
        return DB::transaction(function () use ($procurement, $data) {
            $procurement->update([
                'reference_number' => $data['reference_number'] ?? $procurement->reference_number,
                'status' => $data['status'] ?? $procurement->status,
                'publication_date' => $data['publication_date'] ?? $procurement->publication_date,
                'deadline' => $data['deadline'] ?? $procurement->deadline,
            ]);

            foreach ($data['translations'] as $lang => $translation) {
                ProcurementTranslation::updateOrCreate(
                    ['procurement_id' => $procurement->id, 'language' => $lang],
                    ['title' => $translation['title'] ?? '', 'description' => $translation['description'] ?? null]
                );
            }

            if (isset($data['document_ids'])) {
                $procurement->documents()->sync($data['document_ids']);
            }

            return $procurement->fresh('translations');
        });
    }

    public function delete(Procurement $procurement): void
    {
        $procurement->delete();
    }
}

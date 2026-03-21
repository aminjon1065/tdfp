<?php

namespace App\Modules\Staff\Services;

use App\Core\Helpers\FileHelper;
use App\Models\StaffMember;
use App\Models\StaffMemberTranslation;
use App\Modules\Staff\Repositories\StaffRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class StaffService
{
    public function __construct(private StaffRepository $repository) {}

    public function store(array $data): StaffMember
    {
        return DB::transaction(function () use ($data) {
            $this->assertValidParentHierarchy($data['parent_id'] ?? null);

            $staffMember = $this->repository->create([
                'parent_id' => $data['parent_id'] ?? null,
                'created_by' => auth()->id(),
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'photo_path' => $this->storePhoto($data['photo'] ?? null),
                'is_leadership' => (bool) ($data['is_leadership'] ?? false),
                'is_published' => (bool) ($data['is_published'] ?? true),
                'sort_order' => (int) ($data['sort_order'] ?? 0),
            ]);

            $this->syncTranslations($staffMember, $data['translations']);

            return $staffMember->fresh(['translations', 'parent.translations']);
        });
    }

    public function update(StaffMember $staffMember, array $data): StaffMember
    {
        return DB::transaction(function () use ($staffMember, $data) {
            $this->assertValidParentHierarchy($data['parent_id'] ?? null, $staffMember);

            $updateData = [
                'parent_id' => $data['parent_id'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'is_leadership' => (bool) ($data['is_leadership'] ?? false),
                'is_published' => (bool) ($data['is_published'] ?? false),
                'sort_order' => (int) ($data['sort_order'] ?? 0),
            ];

            if (($data['photo'] ?? null) instanceof UploadedFile) {
                FileHelper::delete($staffMember->photo_path);
                $updateData['photo_path'] = $this->storePhoto($data['photo']);
            }

            $staffMember->update($updateData);
            $this->syncTranslations($staffMember, $data['translations']);

            return $staffMember->fresh(['translations', 'parent.translations']);
        });
    }

    public function delete(StaffMember $staffMember): void
    {
        DB::transaction(function () use ($staffMember) {
            StaffMember::query()
                ->where('parent_id', $staffMember->id)
                ->update(['parent_id' => $staffMember->parent_id]);

            FileHelper::delete($staffMember->photo_path);
            $staffMember->delete();
        });
    }

    private function syncTranslations(StaffMember $staffMember, array $translations): void
    {
        foreach ($translations as $language => $translation) {
            StaffMemberTranslation::updateOrCreate(
                [
                    'staff_member_id' => $staffMember->id,
                    'language' => $language,
                ],
                [
                    'full_name' => $translation['full_name'],
                    'job_title' => $translation['job_title'],
                    'department' => $translation['department'] ?? null,
                    'biography' => $translation['biography'] ?? null,
                ]
            );
        }
    }

    private function storePhoto(mixed $photo): ?string
    {
        if (! $photo instanceof UploadedFile) {
            return null;
        }

        return FileHelper::store($photo, 'staff');
    }

    private function assertValidParentHierarchy(?int $parentId, ?StaffMember $staffMember = null): void
    {
        if ($parentId === null) {
            return;
        }

        $ancestorId = $parentId;

        while ($ancestorId !== null) {
            if ($staffMember !== null && $ancestorId === (int) $staffMember->getKey()) {
                abort(422, 'A staff member cannot report to one of their own descendants.');
            }

            $ancestorId = StaffMember::query()
                ->whereKey($ancestorId)
                ->value('parent_id');
        }
    }
}

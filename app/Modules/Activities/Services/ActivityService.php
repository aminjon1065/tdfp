<?php

namespace App\Modules\Activities\Services;

use App\ActivityStatus;
use App\Core\Helpers\FileHelper;
use App\Core\Helpers\SlugHelper;
use App\Models\Activity;
use App\Models\ActivityTranslation;
use App\Modules\Activities\Repositories\ActivityRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class ActivityService
{
    public function __construct(private ActivityRepository $repository) {}

    public function store(array $data): Activity
    {
        return DB::transaction(function () use ($data) {
            $title = $data['translations']['en']['title'] ?? $data['translations']['ru']['title'] ?? 'activity';
            $slug = SlugHelper::generate($title, Activity::class);

            $imagePath = null;
            if (isset($data['featured_image']) && $data['featured_image'] instanceof UploadedFile) {
                $imagePath = FileHelper::store($data['featured_image'], 'activities');
            }

            $activity = $this->repository->create([
                'slug' => $slug,
                'status' => $data['status'] ?? ActivityStatus::Planned->value,
                'domain_slug' => $data['domain_slug'] ?? null,
                'activity_number' => $data['activity_number'] ?? null,
                'start_date' => $data['start_date'] ?? null,
                'end_date' => $data['end_date'] ?? null,
                'featured_image' => $imagePath,
                'created_by' => auth()->id(),
            ]);

            foreach ($data['translations'] as $lang => $translation) {
                ActivityTranslation::create([
                    'activity_id' => $activity->id,
                    'language' => $lang,
                    'title' => $translation['title'] ?? '',
                    'description' => $translation['description'] ?? null,
                    'objectives' => $translation['objectives'] ?? null,
                ]);
            }

            return $activity;
        });
    }

    public function update(Activity $activity, array $data): Activity
    {
        return DB::transaction(function () use ($activity, $data) {
            $updateData = [
                'status' => $data['status'] ?? $activity->status,
                'domain_slug' => $data['domain_slug'] ?? $activity->domain_slug,
                'activity_number' => $data['activity_number'] ?? $activity->activity_number,
                'start_date' => $data['start_date'] ?? $activity->start_date,
                'end_date' => $data['end_date'] ?? $activity->end_date,
            ];

            if (isset($data['featured_image']) && $data['featured_image'] instanceof UploadedFile) {
                FileHelper::delete($activity->featured_image);
                $updateData['featured_image'] = FileHelper::store($data['featured_image'], 'activities');
            }

            $activity->update($updateData);

            foreach ($data['translations'] as $lang => $translation) {
                ActivityTranslation::updateOrCreate(
                    ['activity_id' => $activity->id, 'language' => $lang],
                    [
                        'title' => $translation['title'] ?? '',
                        'description' => $translation['description'] ?? null,
                        'objectives' => $translation['objectives'] ?? null,
                    ]
                );
            }

            return $activity->fresh('translations');
        });
    }

    public function delete(Activity $activity): void
    {
        FileHelper::delete($activity->featured_image);
        $activity->delete();
    }
}

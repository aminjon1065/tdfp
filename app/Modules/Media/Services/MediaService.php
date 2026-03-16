<?php
namespace App\Modules\Media\Services;
use App\Core\Helpers\FileHelper;
use App\Models\MediaItem;
use App\Models\MediaItemTranslation;
use App\Modules\Media\Repositories\MediaRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class MediaService
{
    public function __construct(private MediaRepository $repository) {}

    public function store(array $data): MediaItem
    {
        return DB::transaction(function () use ($data) {
            $filePath = null;
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                $dir = $data['type'] === 'video' ? 'media/videos' : 'media/images';
                $filePath = FileHelper::store($data['file'], $dir);
            }

            $mediaItem = $this->repository->create([
                'type' => $data['type'] ?? 'image',
                'file_path' => $filePath,
                'embed_url' => $data['embed_url'] ?? null,
                'uploaded_by' => auth()->id(),
            ]);

            foreach ($data['translations'] as $lang => $translation) {
                MediaItemTranslation::create([
                    'media_item_id' => $mediaItem->id,
                    'language' => $lang,
                    'title' => $translation['title'] ?? null,
                    'description' => $translation['description'] ?? null,
                ]);
            }

            return $mediaItem;
        });
    }

    public function delete(MediaItem $mediaItem): void
    {
        FileHelper::delete($mediaItem->file_path);
        $mediaItem->delete();
    }
}

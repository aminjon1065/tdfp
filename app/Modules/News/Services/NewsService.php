<?php
namespace App\Modules\News\Services;
use App\Core\Helpers\FileHelper;
use App\Core\Helpers\SlugHelper;
use App\Models\News;
use App\Models\NewsTranslation;
use App\Modules\News\Repositories\NewsRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class NewsService
{
    public function __construct(private NewsRepository $repository) {}

    public function store(array $data): News
    {
        return DB::transaction(function () use ($data) {
            $title = $data['translations']['en']['title'] ?? $data['translations']['ru']['title'] ?? 'news';
            $slug = SlugHelper::generate($title, News::class);

            $imagePath = null;
            if (isset($data['featured_image']) && $data['featured_image'] instanceof UploadedFile) {
                $imagePath = FileHelper::store($data['featured_image'], 'news');
            }

            $news = $this->repository->create([
                'slug' => $slug,
                'category_id' => $data['category_id'] ?? null,
                'author_id' => auth()->id(),
                'featured_image' => $imagePath,
                'is_featured' => $data['is_featured'] ?? false,
                'status' => $data['status'] ?? 'draft',
                'published_at' => ($data['status'] ?? 'draft') === 'published' ? now() : null,
            ]);

            foreach ($data['translations'] as $lang => $translation) {
                NewsTranslation::create([
                    'news_id' => $news->id,
                    'language' => $lang,
                    'title' => $translation['title'] ?? '',
                    'summary' => $translation['summary'] ?? null,
                    'content' => $translation['content'] ?? null,
                ]);
            }

            return $news;
        });
    }

    public function update(News $news, array $data): News
    {
        return DB::transaction(function () use ($news, $data) {
            $updateData = [
                'category_id' => $data['category_id'] ?? $news->category_id,
                'is_featured' => $data['is_featured'] ?? $news->is_featured,
                'status' => $data['status'] ?? $news->status,
                'published_at' => ($data['status'] ?? $news->status) === 'published' && !$news->published_at ? now() : $news->published_at,
            ];

            if (isset($data['featured_image']) && $data['featured_image'] instanceof UploadedFile) {
                FileHelper::delete($news->featured_image);
                $updateData['featured_image'] = FileHelper::store($data['featured_image'], 'news');
            }

            $news->update($updateData);

            foreach ($data['translations'] as $lang => $translation) {
                NewsTranslation::updateOrCreate(
                    ['news_id' => $news->id, 'language' => $lang],
                    [
                        'title' => $translation['title'] ?? '',
                        'summary' => $translation['summary'] ?? null,
                        'content' => $translation['content'] ?? null,
                    ]
                );
            }

            return $news->fresh('translations');
        });
    }

    public function delete(News $news): void
    {
        FileHelper::delete($news->featured_image);
        $news->delete();
    }
}

<?php
namespace App\Modules\CMS\Services;
use App\Core\Helpers\SlugHelper;
use App\Models\Page;
use App\Models\PageTranslation;
use App\Modules\CMS\Repositories\PageRepository;
use Illuminate\Support\Facades\DB;

class PageService
{
    public function __construct(private PageRepository $repository) {}

    public function store(array $data): Page
    {
        return DB::transaction(function () use ($data) {
            $slug = SlugHelper::generate($data['translations']['en']['title'] ?? $data['slug'] ?? 'page', Page::class);
            $page = $this->repository->create([
                'slug' => $slug,
                'status' => $data['status'] ?? 'draft',
                'created_by' => auth()->id(),
                'published_at' => $data['status'] === 'published' ? now() : null,
            ]);

            foreach ($data['translations'] as $lang => $translation) {
                PageTranslation::create([
                    'page_id' => $page->id,
                    'language' => $lang,
                    'title' => $translation['title'] ?? '',
                    'content' => $translation['content'] ?? null,
                    'meta_title' => $translation['meta_title'] ?? null,
                    'meta_description' => $translation['meta_description'] ?? null,
                ]);
            }

            return $page;
        });
    }

    public function update(Page $page, array $data): Page
    {
        return DB::transaction(function () use ($page, $data) {
            $page->update([
                'status' => $data['status'] ?? $page->status,
                'published_at' => $data['status'] === 'published' && !$page->published_at ? now() : $page->published_at,
            ]);

            foreach ($data['translations'] as $lang => $translation) {
                PageTranslation::updateOrCreate(
                    ['page_id' => $page->id, 'language' => $lang],
                    [
                        'title' => $translation['title'] ?? '',
                        'content' => $translation['content'] ?? null,
                        'meta_title' => $translation['meta_title'] ?? null,
                        'meta_description' => $translation['meta_description'] ?? null,
                    ]
                );
            }

            return $page->fresh('translations');
        });
    }

    public function delete(Page $page): void
    {
        $page->delete();
    }
}

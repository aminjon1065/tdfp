<?php
namespace App\Modules\CMS\Repositories;
use App\Core\Repositories\BaseRepository;
use App\Models\Page;
use Illuminate\Pagination\LengthAwarePaginator;

class PageRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Page());
    }

    public function paginateWithTranslations(int $perPage = 15): LengthAwarePaginator
    {
        return Page::with('translations', 'creator')->latest()->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Page
    {
        return Page::with('translations')->where('slug', $slug)->first();
    }

    public function findPublishedBySlug(string $slug): ?Page
    {
        return Page::with('translations')->where('slug', $slug)->where('status', 'published')->first();
    }
}

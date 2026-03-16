<?php
namespace App\Modules\Search\Services;
use App\Models\SearchIndex;
use Illuminate\Pagination\LengthAwarePaginator;

class SearchService
{
    public function search(string $query, string $language = 'en', array $filters = []): LengthAwarePaginator
    {
        $q = SearchIndex::where('language', $language)
            ->where(function($builder) use ($query) {
                $builder->where('title', 'like', '%'.$query.'%')
                    ->orWhere('content', 'like', '%'.$query.'%');
            });

        if (!empty($filters['entity_type'])) {
            $q->where('entity_type', $filters['entity_type']);
        }

        return $q->paginate(15);
    }

    public function index(string $entityType, int $entityId, string $title, ?string $content, string $language, string $url): void
    {
        SearchIndex::updateOrCreate(
            ['entity_type' => $entityType, 'entity_id' => $entityId, 'language' => $language],
            ['title' => $title, 'content' => $content, 'url' => $url]
        );
    }

    public function remove(string $entityType, int $entityId): void
    {
        SearchIndex::where('entity_type', $entityType)->where('entity_id', $entityId)->delete();
    }
}

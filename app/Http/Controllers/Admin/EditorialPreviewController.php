<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Modules\CMS\Requests\PreviewPageRequest;
use App\Modules\CMS\Support\EditorialPreviewStore;
use App\Modules\News\Requests\PreviewNewsRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class EditorialPreviewController extends Controller
{
    public function __construct(
        private readonly EditorialPreviewStore $previewStore
    ) {}

    public function storePage(PreviewPageRequest $request): JsonResponse
    {
        $token = $this->previewStore->put('page', $request->user()->id, $request->validated());

        return response()->json([
            'preview_url' => route('admin.editorial-preview.pages.show', $token),
        ]);
    }

    public function showPage(string $token): Response
    {
        $payload = $this->previewStore->get('page', $token, auth()->id());

        abort_if($payload === null, 404);

        return Inertia::render('public/page', [
            'page' => [
                'slug' => '__preview',
                'status' => $payload['status'],
                'translations' => $this->mapTranslations($payload['translations']),
            ],
            'previewMeta' => $this->previewMeta(),
        ]);
    }

    public function storeNews(PreviewNewsRequest $request): JsonResponse
    {
        $token = $this->previewStore->put('news', $request->user()->id, $request->validated());

        return response()->json([
            'preview_url' => route('admin.editorial-preview.news.show', $token),
        ]);
    }

    public function showNews(string $token): Response
    {
        $payload = $this->previewStore->get('news', $token, auth()->id());

        abort_if($payload === null, 404);

        return Inertia::render('public/news/show', [
            'news' => [
                'id' => 0,
                'slug' => '__preview',
                'status' => $payload['status'],
                'is_featured' => (bool) ($payload['is_featured'] ?? false),
                'featured_image_url' => $payload['featured_image_url'] ?? null,
                'published_at' => null,
                'updated_at' => Carbon::now()->toIso8601String(),
                'author' => [
                    'name' => auth()->user()?->name,
                ],
                'category' => null,
                'translations' => $this->mapTranslations($payload['translations']),
            ],
            'latest' => [],
            'previewMeta' => $this->previewMeta(),
        ]);
    }

    /**
     * @param  array<string, array<string, mixed>>  $translations
     * @return array<int, array<string, mixed>>
     */
    private function mapTranslations(array $translations): array
    {
        return collect($translations)
            ->map(fn (array $translation, string $language): array => [
                'language' => $language,
                ...$translation,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array{label: string, description: string}
     */
    private function previewMeta(): array
    {
        return [
            'label' => 'Editorial preview',
            'description' => 'Draft preview generated from the current admin form state.',
        ];
    }
}

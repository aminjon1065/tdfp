<?php

namespace App\Modules\Media\Controllers;

use App\Core\Helpers\FileHelper;
use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use App\Models\MediaItemTranslation;
use App\Modules\Media\Repositories\MediaRepository;
use App\Modules\Media\Requests\StoreEditorImageRequest;
use App\Modules\Media\Requests\StoreMediaRequest;
use App\Modules\Media\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminMediaController extends Controller
{
    public function __construct(
        private MediaRepository $repository,
        private MediaService $service
    ) {
        $this->authorizeResource(MediaItem::class, 'mediaItem');
    }

    public function index(Request $request): Response
    {
        $media = $this->repository
            ->paginateWithRelations(24, $request->only('type'))
            ->through(fn (MediaItem $item): array => [
                'id' => $item->id,
                'type' => $item->type,
                'url' => FileHelper::url($item->file_path),
                'embed_url' => $item->embed_url,
                'translations' => $item->translations->map(fn (MediaItemTranslation $translation): array => [
                    'language' => $translation->language,
                    'title' => $translation->title,
                    'description' => $translation->description,
                ])->values()->all(),
                'created_at' => $item->created_at?->toISOString(),
            ]);

        return Inertia::render('admin/media/index', [
            'media' => $media,
            'filters' => $request->only('type'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/media/create');
    }

    public function store(StoreMediaRequest $request): RedirectResponse
    {
        $this->service->store($request->validated());

        return redirect()->route('admin.media.index')->with('success', 'Media uploaded.');
    }

    public function storeEditorImage(StoreEditorImageRequest $request): JsonResponse
    {
        $this->authorize('create', MediaItem::class);

        $path = FileHelper::store($request->file('image'), 'media/editor-images');

        $mediaItem = MediaItem::create([
            'type' => 'image',
            'is_public' => false,
            'file_path' => $path,
            'uploaded_by' => $request->user()?->id,
        ]);

        return response()->json([
            'id' => $mediaItem->id,
            'url' => FileHelper::url($path),
            'alt' => $request->validated('alt'),
        ]);
    }

    public function destroy(MediaItem $mediaItem): RedirectResponse
    {
        $this->service->delete($mediaItem);

        return redirect()->route('admin.media.index')->with('success', 'Media deleted.');
    }
}

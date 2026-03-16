<?php

namespace App\Modules\Media\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use App\Modules\Media\Repositories\MediaRepository;
use App\Modules\Media\Requests\StoreMediaRequest;
use App\Modules\Media\Services\MediaService;
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
        return Inertia::render('admin/media/index', [
            'items' => $this->repository->paginateWithRelations(24, $request->only('type')),
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

    public function destroy(MediaItem $mediaItem): RedirectResponse
    {
        $this->service->delete($mediaItem);

        return redirect()->route('admin.media.index')->with('success', 'Media deleted.');
    }
}

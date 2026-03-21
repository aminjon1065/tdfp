<?php

namespace App\Modules\Documents\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Modules\Documents\Repositories\DocumentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PublicDocumentController extends Controller
{
    public function __construct(private DocumentRepository $repository) {}

    public function index(Request $request): Response
    {
        $filters = $request->only('category_id', 'search', 'year', 'file_type', 'tag');

        return Inertia::render('public/documents/index', [
            'documents' => $this->repository->paginatePublishedWithRelations(15, $filters),
            'categories' => DocumentCategory::all(),
            'filters' => $filters,
            'years' => $this->repository->publicArchiveYears(),
            'fileTypes' => $this->repository->publicFileTypes(),
            'tags' => $this->repository->publicTags(),
        ]);
    }

    public function download(Document $document): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        abort_unless($this->repository->isPublished($document), 404);

        $this->repository->incrementDownload($document);

        return Storage::disk('public')->download($document->file_path, $document->translation()->title ?? 'document');
    }
}

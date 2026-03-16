<?php

namespace App\Modules\Documents\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Modules\Documents\Repositories\DocumentRepository;
use App\Modules\Documents\Requests\StoreDocumentRequest;
use App\Modules\Documents\Requests\UpdateDocumentRequest;
use App\Modules\Documents\Services\DocumentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDocumentController extends Controller
{
    public function __construct(
        private DocumentRepository $repository,
        private DocumentService $service
    ) {
        $this->authorizeResource(Document::class, 'document');
    }

    public function index(Request $request): Response
    {
        return Inertia::render('admin/documents/index', [
            'documents' => $this->repository->paginateWithRelations(15, $request->only('category_id', 'search')),
            'categories' => DocumentCategory::all(),
            'filters' => $request->only('category_id', 'search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/documents/create', ['categories' => DocumentCategory::all()]);
    }

    public function store(StoreDocumentRequest $request): RedirectResponse
    {
        $this->service->store($request->validated());

        return redirect()->route('admin.documents.index')->with('success', 'Document uploaded.');
    }

    public function edit(Document $document): Response
    {
        $document->load('translations', 'category');

        return Inertia::render('admin/documents/edit', [
            'document' => $document,
            'categories' => DocumentCategory::all(),
        ]);
    }

    public function update(UpdateDocumentRequest $request, Document $document): RedirectResponse
    {
        $this->service->update($document, $request->validated());

        return redirect()->route('admin.documents.index')->with('success', 'Document updated.');
    }

    public function destroy(Document $document): RedirectResponse
    {
        $this->service->delete($document);

        return redirect()->route('admin.documents.index')->with('success', 'Document deleted.');
    }
}

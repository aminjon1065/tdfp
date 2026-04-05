<?php

namespace App\Modules\Documents\Services;

use App\Core\Helpers\FileHelper;
use App\Models\Document;
use App\Models\DocumentTranslation;
use App\Modules\Documents\Repositories\DocumentRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class DocumentService
{
    public function __construct(private DocumentRepository $repository) {}

    public function store(array $data): Document
    {
        return DB::transaction(function () use ($data) {
            $filePath = null;
            $fileType = null;
            $fileSize = null;
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                $filePath = FileHelper::store($data['file'], 'documents');
                $fileType = $data['file']->getClientOriginalExtension();
                $fileSize = $data['file']->getSize();
            }

            $document = $this->repository->create([
                'category_id' => $data['category_id'] ?? null,
                'file_path' => $filePath,
                'file_type' => $fileType,
                'file_size' => $fileSize,
                'uploaded_by' => auth()->id(),
                'published_at' => now(),
            ]);

            foreach ($data['translations'] as $lang => $translation) {
                DocumentTranslation::create([
                    'document_id' => $document->id,
                    'language' => $lang,
                    'title' => $translation['title'] ?? '',
                    'description' => $translation['description'] ?? null,
                ]);
            }

            return $document;
        });
    }

    public function update(Document $document, array $data): Document
    {
        return DB::transaction(function () use ($document, $data) {
            $updateData = ['category_id' => $data['category_id'] ?? $document->category_id];

            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                FileHelper::delete($document->file_path);
                $updateData['file_path'] = FileHelper::store($data['file'], 'documents');
                $updateData['file_type'] = $data['file']->getClientOriginalExtension();
                $updateData['file_size'] = $data['file']->getSize();
            }

            $document->update($updateData);

            foreach ($data['translations'] as $lang => $translation) {
                DocumentTranslation::updateOrCreate(
                    ['document_id' => $document->id, 'language' => $lang],
                    ['title' => $translation['title'] ?? '', 'description' => $translation['description'] ?? null]
                );
            }

            return $document->fresh('translations');
        });
    }

    public function delete(Document $document): void
    {
        FileHelper::delete($document->file_path);
        $document->delete();
    }
}

<?php

namespace App\Modules\Media\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Media\Repositories\MediaRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicMediaController extends Controller
{
    public function __construct(private MediaRepository $repository) {}

    public function index(Request $request): Response
    {
        $filters = $request->only('type', 'lang');

        return Inertia::render('public/media/index', [
            'items' => $this->repository->paginatePublicWithRelations(24, $filters),
            'filters' => $filters,
        ]);
    }
}

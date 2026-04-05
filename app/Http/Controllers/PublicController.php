<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Modules\Activities\Repositories\ActivityRepository;
use App\Modules\CMS\Repositories\PageRepository;
use App\Modules\Documents\Repositories\DocumentRepository;
use App\Modules\News\Repositories\NewsRepository;
use App\Modules\Procurement\Repositories\ProcurementRepository;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function __construct(
        private NewsRepository $newsRepository,
        private ActivityRepository $activityRepository,
        private PageRepository $pageRepository,
        private DocumentRepository $documentRepository,
        private ProcurementRepository $procurementRepository,
    ) {}

    public function home(): Response
    {
        return Inertia::render('public/home', [
            'latestNews' => $this->newsRepository->latestPublished(6),
            'whatsNew' => $this->newsRepository->featuredAnnouncements(4),
            'newsRecentWindowDays' => $this->newsRepository->recentWindowDays(),
            'activities' => $this->activityRepository->allPublicWithTranslations(),
            'latestDocuments' => $this->documentRepository->latestPublished(4),
            'openProcurements' => $this->procurementRepository->openProcurements(4),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('public/contact', [
            'settings' => Setting::many([
                'contact_email',
                'contact_phone',
                'contact_address',
            ], [
                'contact_email' => 'info@pic.tj',
                'contact_phone' => '+992 000 000 000',
                'contact_address' => 'Dushanbe, Tajikistan',
            ]),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('public/about', [
            'page' => $this->pageRepository->findPublishedBySlug('about'),
        ]);
    }

    public function projects(): Response
    {
        return Inertia::render('public/projects/index');
    }

    public function showProject(string $slug): Response
    {
        abort_if($slug !== 'tdfp', 404);

        return Inertia::render('public/projects/show', [
            'slug' => $slug,
            'projectDocuments' => $this->documentRepository->latestPublished(5),
        ]);
    }
}

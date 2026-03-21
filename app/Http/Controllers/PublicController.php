<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Modules\Activities\Repositories\ActivityRepository;
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
            'settings' => Setting::all()->pluck('value', 'key'),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('public/contact', [
            'settings' => Setting::whereIn('key', ['contact_email', 'contact_phone', 'contact_address'])->get()->pluck('value', 'key'),
        ]);
    }
}

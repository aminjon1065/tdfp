<?php
namespace App\Modules\Admin\Controllers;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\GrmCase;
use App\Models\News;
use App\Models\Document;
use App\Models\Procurement;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'news_count' => News::where('status', 'published')->count(),
                'documents_count' => Document::count(),
                'open_grm_cases' => GrmCase::whereIn('status', ['submitted', 'under_review', 'investigation'])->count(),
                'open_procurements' => Procurement::where('status', 'open')->count(),
            ],
            'recent_news' => News::with('translations')->where('status', 'published')
                ->latest('published_at')->limit(5)->get(),
            'recent_grm' => GrmCase::latest()->limit(5)->get(),
            'recent_logs' => AuditLog::with('user')->latest('created_at')->limit(10)->get(),
        ]);
    }
}

<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Document;
use App\Models\GrmCase;
use App\Models\News;
use App\Models\Procurement;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => Cache::remember('admin.dashboard.stats', now()->addMinutes(5), fn () => [
                'news_count' => News::where('status', 'published')->count(),
                'documents_count' => Document::count(),
                'open_grm_cases' => GrmCase::whereIn('status', ['submitted', 'under_review', 'investigation'])->count(),
                'open_procurements' => Procurement::where('status', 'open')->count(),
            ]),
            'operational_readiness' => $this->operationalReadiness(),
            'recent_news' => News::with('translations')->where('status', 'published')
                ->latest('published_at')->limit(5)->get(),
            'recent_grm' => GrmCase::latest()->limit(5)->get(),
            'recent_logs' => AuditLog::with('user')->latest('created_at')->limit(10)->get(),
        ]);
    }

    /**
     * @return array{
     *     completion_percentage:int,
     *     is_ready:bool,
     *     missing_count:int,
     *     items:array<int, array{key:string,label:string,is_complete:bool,value:?string}>
     * }
     */
    private function operationalReadiness(): array
    {
        $items = [
            [
                'key' => 'analytics_owner_name',
                'label' => 'Analytics owner',
                'value' => Setting::get('analytics_owner_name'),
            ],
            [
                'key' => 'analytics_owner_email',
                'label' => 'Analytics owner email',
                'value' => Setting::get('analytics_owner_email'),
            ],
            [
                'key' => 'google_analytics_id',
                'label' => 'GA4 measurement ID',
                'value' => Setting::get('analytics_enabled') === '1'
                    ? Setting::get('google_analytics_id')
                    : 'Analytics disabled',
            ],
            [
                'key' => 'support_contact_name',
                'label' => 'Support contact',
                'value' => Setting::get('support_contact_name'),
            ],
            [
                'key' => 'support_contact_email',
                'label' => 'Support email',
                'value' => Setting::get('support_contact_email'),
            ],
            [
                'key' => 'incident_contact_email',
                'label' => 'Incident escalation email',
                'value' => Setting::get('incident_contact_email'),
            ],
            [
                'key' => 'maintenance_report_email',
                'label' => 'Maintenance reporting email',
                'value' => Setting::get('maintenance_report_email'),
            ],
            [
                'key' => 'backup_frequency',
                'label' => 'Backup frequency',
                'value' => Setting::get('backup_frequency'),
            ],
            [
                'key' => 'backup_retention_days',
                'label' => 'Backup retention days',
                'value' => Setting::get('backup_retention_days'),
            ],
        ];

        $items = array_map(function (array $item): array {
            $value = is_string($item['value']) ? trim($item['value']) : $item['value'];
            $isComplete = $value !== null && $value !== '';

            return [
                ...$item,
                'value' => $value,
                'is_complete' => $isComplete,
            ];
        }, $items);

        $completeCount = count(array_filter($items, fn (array $item): bool => $item['is_complete']));
        $totalCount = count($items);

        return [
            'completion_percentage' => (int) floor(($completeCount / max($totalCount, 1)) * 100),
            'is_ready' => $completeCount === $totalCount,
            'missing_count' => $totalCount - $completeCount,
            'items' => $items,
        ];
    }
}

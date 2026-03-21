<?php

namespace App\Core\Services;

use App\Models\Setting;

class OperationalAuditService
{
    public function __construct(
        private AccessibilityAuditService $accessibilityAuditService,
        private BrokenLinkAuditService $brokenLinkAuditService,
        private PublicSmokeAuditService $publicSmokeAuditService,
    ) {}

    /**
     * @return array{
     *     governance: array{
     *         completion_percentage:int,
     *         is_ready:bool,
     *         missing_count:int,
     *         items:array<int, array{key:string,label:string,is_complete:bool,value:?string}>
     *     },
     *     automated_checks: array{
     *         passing_count:int,
     *         failing_count:int,
     *         items:array<int, array{key:string,label:string,is_passing:bool,issue_count:int,checked_count:int,summary:string}>
     *     },
     *     overall: array{
     *         completion_percentage:int,
     *         is_ready:bool,
     *         missing_count:int,
     *         failing_checks_count:int
     *     }
     * }
     */
    public function audit(): array
    {
        $governance = $this->governance();
        $automatedChecks = $this->automatedChecks();

        $totalUnits = count($governance['items']) + count($automatedChecks['items']);
        $passedUnits = count(array_filter($governance['items'], fn (array $item): bool => $item['is_complete']))
            + $automatedChecks['passing_count'];

        return [
            'governance' => $governance,
            'automated_checks' => $automatedChecks,
            'overall' => [
                'completion_percentage' => (int) floor(($passedUnits / max($totalUnits, 1)) * 100),
                'is_ready' => $governance['is_ready'] && $automatedChecks['failing_count'] === 0,
                'missing_count' => $governance['missing_count'],
                'failing_checks_count' => $automatedChecks['failing_count'],
            ],
        ];
    }

    /**
     * @return array{
     *     completion_percentage:int,
     *     is_ready:bool,
     *     missing_count:int,
     *     items:array<int, array{key:string,label:string,is_complete:bool,value:?string}>
     * }
     */
    private function governance(): array
    {
        $items = [
            ['key' => 'analytics_owner_name', 'label' => 'Analytics owner', 'value' => Setting::get('analytics_owner_name')],
            ['key' => 'analytics_owner_email', 'label' => 'Analytics owner email', 'value' => Setting::get('analytics_owner_email')],
            [
                'key' => 'google_analytics_id',
                'label' => 'GA4 measurement ID',
                'value' => Setting::get('analytics_enabled') === '1'
                    ? Setting::get('google_analytics_id')
                    : 'Analytics disabled',
            ],
            ['key' => 'support_contact_name', 'label' => 'Support contact', 'value' => Setting::get('support_contact_name')],
            ['key' => 'support_contact_email', 'label' => 'Support email', 'value' => Setting::get('support_contact_email')],
            ['key' => 'support_contact_phone', 'label' => 'Support phone', 'value' => Setting::get('support_contact_phone')],
            ['key' => 'support_hours', 'label' => 'Support hours', 'value' => Setting::get('support_hours')],
            ['key' => 'incident_contact_email', 'label' => 'Incident escalation email', 'value' => Setting::get('incident_contact_email')],
            ['key' => 'maintenance_report_email', 'label' => 'Maintenance reporting email', 'value' => Setting::get('maintenance_report_email')],
            ['key' => 'backup_frequency', 'label' => 'Backup frequency', 'value' => Setting::get('backup_frequency')],
            ['key' => 'backup_retention_days', 'label' => 'Backup retention days', 'value' => Setting::get('backup_retention_days')],
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

    /**
     * @return array{
     *     passing_count:int,
     *     failing_count:int,
     *     items:array<int, array{key:string,label:string,is_passing:bool,issue_count:int,checked_count:int,summary:string}>
     * }
     */
    private function automatedChecks(): array
    {
        $accessibilityReports = $this->accessibilityAuditService->audit();
        $accessibilityIssues = count(collect($accessibilityReports)->flatMap(fn (array $report): array => $report['issues']));

        $linkReports = $this->brokenLinkAuditService->audit();
        $linkIssues = count(collect($linkReports)->flatMap(fn (array $report): array => $report['issues']));

        $smokeResults = $this->publicSmokeAuditService->audit();
        $smokeFailures = count(array_filter($smokeResults, fn (array $result): bool => ! $result['ok']));

        $items = [
            [
                'key' => 'accessibility',
                'label' => 'Accessibility source audit',
                'is_passing' => $accessibilityIssues === 0,
                'issue_count' => $accessibilityIssues,
                'checked_count' => count($accessibilityReports),
                'summary' => $accessibilityIssues === 0
                    ? sprintf('Passed across %d audited files.', count($accessibilityReports))
                    : sprintf('%d issue(s) across %d files.', $accessibilityIssues, count($accessibilityReports)),
            ],
            [
                'key' => 'broken_links',
                'label' => 'Broken link audit',
                'is_passing' => $linkIssues === 0,
                'issue_count' => $linkIssues,
                'checked_count' => count($linkReports),
                'summary' => $linkIssues === 0
                    ? sprintf('Passed across %d audited files.', count($linkReports))
                    : sprintf('%d broken link issue(s) across %d files.', $linkIssues, count($linkReports)),
            ],
            [
                'key' => 'public_smoke',
                'label' => 'Public route smoke matrix',
                'is_passing' => $smokeFailures === 0,
                'issue_count' => $smokeFailures,
                'checked_count' => count($smokeResults),
                'summary' => $smokeFailures === 0
                    ? sprintf('Passed across %d requests.', count($smokeResults))
                    : sprintf('%d failing request(s) out of %d checked.', $smokeFailures, count($smokeResults)),
            ],
        ];

        return [
            'passing_count' => count(array_filter($items, fn (array $item): bool => $item['is_passing'])),
            'failing_count' => count(array_filter($items, fn (array $item): bool => ! $item['is_passing'])),
            'items' => $items,
        ];
    }
}

<?php

namespace App\Console\Commands;

use App\Core\Services\OperationalAuditService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class OperationsAuditCommand extends Command
{
    protected $signature = 'operations:audit';

    protected $description = 'Run an operational readiness and automated compliance audit';

    public function __construct(
        private OperationalAuditService $operationalAuditService,
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $audit = $this->operationalAuditService->audit();

        Cache::put(
            OperationalAuditService::CACHE_KEY,
            $audit,
            now()->addMinutes(10),
        );

        $this->components->info(sprintf(
            'Overall readiness: %d%%',
            $audit['overall']['completion_percentage']
        ));

        $this->table(
            ['Governance Item', 'Value', 'Status'],
            collect($audit['governance']['items'])->map(fn (array $item): array => [
                $item['label'],
                $item['value'] ?? 'Not configured',
                $item['is_complete'] ? 'Ready' : 'Missing',
            ])->all()
        );

        $this->table(
            ['Automated Check', 'Summary', 'Status'],
            collect($audit['automated_checks']['items'])->map(fn (array $item): array => [
                $item['label'],
                $item['summary'],
                $item['is_passing'] ? 'Pass' : 'Fail',
            ])->all()
        );

        if ($audit['overall']['is_ready']) {
            $this->components->info('Operational audit passed.');

            return self::SUCCESS;
        }

        $this->components->error(sprintf(
            'Operational audit is not ready. %d governance item(s) missing, %d automated check(s) failing.',
            $audit['overall']['missing_count'],
            $audit['overall']['failing_checks_count']
        ));

        return self::FAILURE;
    }
}

<?php

namespace App\Console\Commands;

use App\Core\Services\AccessibilityAuditService;
use Illuminate\Console\Command;

class AccessibilityAuditCommand extends Command
{
    protected $signature = 'accessibility:audit
        {path?* : Specific TSX files or directories to audit}';

    protected $description = 'Audit public-facing TSX files for common accessibility regressions';

    public function __construct(
        private AccessibilityAuditService $accessibilityAuditService,
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $reports = $this->accessibilityAuditService->audit(
            $this->argument('path')
        );

        if ($reports === []) {
            $this->components->error('No TSX files were found for auditing.');

            return self::FAILURE;
        }

        $rows = collect($reports)
            ->flatMap(function (array $report): array {
                return collect($report['issues'])
                    ->map(fn (array $issue): array => [
                        $this->relativePath($report['path']),
                        $issue['line'],
                        $issue['rule'],
                        $issue['message'],
                    ])
                    ->all();
            })
            ->all();

        if ($rows === []) {
            $this->components->info(sprintf(
                'Accessibility audit passed. %d files scanned.',
                count($reports)
            ));

            return self::SUCCESS;
        }

        $this->components->error(sprintf(
            'Accessibility audit found %d issue(s) across %d file(s).',
            count($rows),
            collect($reports)->filter(fn (array $report): bool => $report['issues'] !== [])->count()
        ));

        $this->table(['File', 'Line', 'Rule', 'Message'], $rows);

        return self::FAILURE;
    }

    private function relativePath(string $path): string
    {
        return ltrim(str_replace(base_path(), '', $path), DIRECTORY_SEPARATOR);
    }
}

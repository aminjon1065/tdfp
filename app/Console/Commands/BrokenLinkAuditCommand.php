<?php

namespace App\Console\Commands;

use App\Core\Services\BrokenLinkAuditService;
use Illuminate\Console\Command;

class BrokenLinkAuditCommand extends Command
{
    protected $signature = 'links:audit
        {path?* : Specific TSX files or directories to audit}';

    protected $description = 'Audit public TSX source files for broken literal internal links';

    public function __construct(
        private BrokenLinkAuditService $brokenLinkAuditService,
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $reports = $this->brokenLinkAuditService->audit(
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
                        $issue['link'],
                        $issue['message'],
                    ])
                    ->all();
            })
            ->all();

        if ($rows === []) {
            $this->components->info(sprintf(
                'Broken link audit passed. %d files scanned.',
                count($reports)
            ));

            return self::SUCCESS;
        }

        $this->components->error(sprintf(
            'Broken link audit found %d issue(s) across %d file(s).',
            count($rows),
            collect($reports)->filter(fn (array $report): bool => $report['issues'] !== [])->count()
        ));

        $this->table(['File', 'Line', 'Link', 'Message'], $rows);

        return self::FAILURE;
    }

    private function relativePath(string $path): string
    {
        return ltrim(str_replace(base_path(), '', $path), DIRECTORY_SEPARATOR);
    }
}

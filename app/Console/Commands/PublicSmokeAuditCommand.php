<?php

namespace App\Console\Commands;

use App\Core\Services\PublicSmokeAuditService;
use Illuminate\Console\Command;

class PublicSmokeAuditCommand extends Command
{
    protected $signature = 'public:smoke-audit';

    protected $description = 'Run a public route smoke matrix across desktop, mobile, and bot user agents';

    public function __construct(
        private PublicSmokeAuditService $publicSmokeAuditService,
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $results = $this->publicSmokeAuditService->audit();
        $failures = collect($results)->where('ok', false)->values();

        if ($failures->isEmpty()) {
            $this->components->info(sprintf(
                'Public smoke audit passed. %d requests checked across %d profiles.',
                count($results),
                count($this->publicSmokeAuditService->profiles())
            ));

            return self::SUCCESS;
        }

        $this->components->error(sprintf(
            'Public smoke audit found %d failing request(s).',
            $failures->count()
        ));

        $this->table(
            ['Profile', 'URL', 'Status'],
            $failures->map(fn (array $result): array => [
                $result['profile'],
                $result['url'],
                $result['status'],
            ])->all()
        );

        return self::FAILURE;
    }
}

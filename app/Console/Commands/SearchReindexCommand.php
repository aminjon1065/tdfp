<?php

namespace App\Console\Commands;

use App\Models\SearchIndex;
use App\Modules\Search\Services\SearchService;
use Illuminate\Console\Command;

class SearchReindexCommand extends Command
{
    protected $signature = 'search:reindex';

    protected $description = 'Rebuild the public search index from current published content';

    public function __construct(
        private SearchService $searchService,
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->components->info('Rebuilding public search index...');

        $this->searchService->reindexAll();

        $this->components->info(sprintf(
            'Search index rebuilt successfully. %d records indexed.',
            SearchIndex::query()->count()
        ));

        return self::SUCCESS;
    }
}

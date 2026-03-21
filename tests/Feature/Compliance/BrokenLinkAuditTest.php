<?php

use App\Core\Services\BrokenLinkAuditService;

test('broken link audit passes for current public tsx sources', function () {
    $reports = app(BrokenLinkAuditService::class)->audit();

    $issues = collect($reports)->flatMap(fn (array $report): array => $report['issues']);

    expect($reports)->not->toBeEmpty()
        ->and($issues)->toHaveCount(0);

    $this->artisan('links:audit')
        ->assertSuccessful();
});

test('broken link audit reports invalid literal internal links', function () {
    $directory = sys_get_temp_dir().'/tdfp-links-'.str()->random(10).'/resources/js/pages/public';

    mkdir($directory, 0777, true);

    $file = $directory.'/broken-links.tsx';

    file_put_contents($file, <<<'TSX'
import { Link, router } from '@inertiajs/react';

export default function BrokenLinks() {
    return (
        <div>
            <Link href="/missing-page">Missing page</Link>
            <button type="button" onClick={() => router.get('/missing-search-target')}>
                Missing target
            </button>
        </div>
    );
}
TSX);

    $reports = app(BrokenLinkAuditService::class)->audit([$file]);
    $issues = collect($reports)->flatMap(fn (array $report): array => $report['issues']);

    expect($issues)->toHaveCount(2)
        ->and($issues->pluck('rule')->unique()->all())->toBe(['broken-internal-link'])
        ->and($issues->pluck('link')->all())->toContain('/missing-page', '/missing-search-target');

    $this->artisan('links:audit', ['path' => [$file]])
        ->assertFailed();

    unlink($file);
    rmdir($directory);
    rmdir(dirname($directory));
    rmdir(dirname(dirname($directory)));
});

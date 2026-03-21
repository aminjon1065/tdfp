<?php

use App\Core\Services\AccessibilityAuditService;

test('accessibility audit passes for current public-facing tsx files', function () {
    $reports = app(AccessibilityAuditService::class)->audit();

    $issues = collect($reports)->flatMap(fn (array $report): array => $report['issues']);

    expect($reports)->not->toBeEmpty()
        ->and($issues)->toHaveCount(0);

    $this->artisan('accessibility:audit')
        ->assertSuccessful();
});

test('accessibility audit reports missing heading alt text and labels', function () {
    $directory = sys_get_temp_dir().'/tdfp-a11y-'.str()->random(10).'/resources/js/pages/public';

    mkdir($directory, 0777, true);

    $file = $directory.'/broken-page.tsx';

    file_put_contents($file, <<<'TSX'
export default function BrokenPage() {
    return (
        <section>
            <img src="/broken.jpg" />
            <input id="email" type="email" />
        </section>
    );
}
TSX);

    $reports = app(AccessibilityAuditService::class)->audit([$file]);
    $issues = collect($reports)->flatMap(fn (array $report): array => $report['issues']);

    expect($issues->pluck('rule')->all())
        ->toContain('missing-h1')
        ->toContain('missing-image-alt')
        ->toContain('missing-form-label');

    $this->artisan('accessibility:audit', ['path' => [$file]])
        ->assertFailed();

    unlink($file);
    rmdir($directory);
    rmdir(dirname($directory));
    rmdir(dirname(dirname($directory)));
});

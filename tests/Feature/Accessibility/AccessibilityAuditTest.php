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

test('accessibility audit accepts page hero headings and jsx skip links', function () {
    $directory = sys_get_temp_dir().'/tdfp-a11y-'.str()->random(10).'/resources/js';

    mkdir($directory.'/layouts', 0777, true);
    mkdir($directory.'/pages/public', 0777, true);

    $layoutFile = $directory.'/layouts/public-layout.tsx';
    $pageFile = $directory.'/pages/public/hero-page.tsx';

    file_put_contents($layoutFile, <<<'TSX'
export default function PublicLayout() {
    return (
        <>
            <a href={'#main-content'}>Skip to main content</a>
            <main id="main-content">Content</main>
        </>
    );
}
TSX);

    file_put_contents($pageFile, <<<'TSX'
import PageHero from '@/components/page-hero';

export default function HeroPage() {
    return <PageHero title="Accessible heading" />;
}
TSX);

    $layoutIssues = app(AccessibilityAuditService::class)->audit([$layoutFile])[0]['issues'];
    $pageIssues = app(AccessibilityAuditService::class)->audit([$pageFile])[0]['issues'];

    expect($layoutIssues)->toBeEmpty()
        ->and($pageIssues)->toBeEmpty();

    unlink($layoutFile);
    unlink($pageFile);
    rmdir($directory.'/layouts');
    rmdir($directory.'/pages/public');
    rmdir($directory.'/pages');
    rmdir($directory);
});

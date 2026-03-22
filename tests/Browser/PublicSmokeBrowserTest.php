<?php

use App\Models\GrmCase;
use App\Models\SearchIndex;
use Pest\Browser\Enums\BrowserType;
use Pest\Browser\Playwright\Playwright;

beforeEach(function () {
    Playwright::setTimeout(10_000);
});

dataset('public_smoke_pages', [
    ['url' => '/', 'selector' => '#main-content'],
    ['url' => '/news', 'selector' => '#news-search-query'],
    ['url' => '/documents', 'selector' => '#document-search-query'],
    ['url' => '/procurement', 'selector' => '#procurement-search-query'],
    ['url' => '/search', 'selector' => '#site-search-query'],
    ['url' => '/grm/submit', 'selector' => '#description'],
    ['url' => '/grm/track', 'selector' => '#ticket_number'],
]);

dataset('public_accessibility_pages', [
    ['url' => '/', 'selector' => '#main-content'],
    ['url' => '/search', 'selector' => '#site-search-query'],
    ['url' => '/grm/submit', 'selector' => '#description'],
    ['url' => '/grm/track', 'selector' => '#ticket_number'],
]);

test('key public routes render without browser smoke issues on desktop', function (string $url, string $selector) {
    visit($url)
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertNoBrokenImages()
        ->assertVisible($selector);
})->with('public_smoke_pages');

test('key public routes render without browser smoke issues on mobile', function (string $url, string $selector) {
    if (Playwright::defaultBrowserType() === BrowserType::FIREFOX) {
        test()->markTestSkipped('Firefox in Pest browser tests does not support mobile device emulation.');
    }

    visit($url)
        ->on()->iPhone14Pro()
        ->assertNoSmoke()
        ->assertVisible($selector);
})->with('public_smoke_pages');

test('critical public routes have no serious accessibility issues in browser checks', function (string $url, string $selector) {
    visit($url)
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertVisible($selector)
        ->assertNoAccessibilityIssues();
})->with('public_accessibility_pages');

test('public search works in a real browser', function () {
    SearchIndex::create([
        'entity_type' => \App\Models\News::class,
        'entity_id' => 9001,
        'title' => 'Portal Browser Result',
        'content' => 'Browser smoke verification content for public search.',
        'language' => 'en',
        'url' => '/news/portal-browser-result',
    ]);

    SearchIndex::create([
        'entity_type' => \App\Models\News::class,
        'entity_id' => 9002,
        'title' => 'Portal Browser Result',
        'content' => 'Browser smoke verification content for public search.',
        'language' => 'ru',
        'url' => '/news/portal-browser-result',
    ]);

    visit('/search')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('q', 'Portal Browser')
        ->keys('#site-search-query', 'Enter')
        ->assertPathIs('/search')
        ->assertSee('Portal Browser Result');
});

test('grm tracking works in a real browser', function () {
    $case = GrmCase::create([
        'ticket_number' => 'GRM-2026-12345',
        'tracking_token' => 'ABCDEF1234567890ABCDEF1234567890',
        'complainant_name' => 'Browser Citizen',
        'email' => 'browser@example.com',
        'category' => 'other',
        'description' => 'Browser verification grievance record.',
        'status' => 'under_review',
    ]);

    $case->statusHistory()->create([
        'status' => 'under_review',
        'notes' => 'Visible status event.',
    ]);

    visit('/grm/track')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('ticket_number', 'GRM-2026-12345')
        ->fill('tracking_token', 'ABCDEF1234567890ABCDEF1234567890')
        ->press('Track')
        ->assertPathIs('/grm/track')
        ->assertSee('GRM-2026-12345')
        ->assertSee('under review');
});

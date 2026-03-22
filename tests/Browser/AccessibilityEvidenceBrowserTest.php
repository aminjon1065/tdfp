<?php

use Pest\Browser\Enums\BrowserType;
use Pest\Browser\Playwright\Playwright;

beforeEach(function () {
    Playwright::setTimeout(15_000);
});

test('skip link moves focus to the main content region', function () {
    $page = visit('/')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertVisible('#main-content');

    $page->script("document.querySelector('a[href=\"#main-content\"]').focus()");

    $page->keys('a[href="#main-content"]', 'Enter')
        ->assertScript('document.activeElement && document.activeElement.id', 'main-content');
});

test('grm submit exposes accessible validation state after an invalid submit', function () {
    visit('/grm/submit')
        ->on()->desktop()
        ->assertNoSmoke()
        ->press('Submit Complaint')
        ->assertScript("document.getElementById('name')?.getAttribute('aria-invalid')", 'true')
        ->assertScript("document.getElementById('email')?.getAttribute('aria-invalid')", 'true')
        ->assertScript("document.getElementById('description')?.getAttribute('aria-invalid')", 'true')
        ->assertScript("document.getElementById('complainant-name-error')?.textContent.trim().length > 0")
        ->assertScript("document.getElementById('grm-email-error')?.textContent.trim().length > 0")
        ->assertScript("document.getElementById('grm-description-error')?.textContent.trim().length > 0");
});

test('mobile navigation opens and moves focus inside the dialog panel', function () {
    if (Playwright::defaultBrowserType() === BrowserType::FIREFOX) {
        test()->markTestSkipped('Firefox in Pest browser tests does not support mobile device emulation.');
    }

    visit('/')
        ->on()->iPhone14Pro()
        ->assertNoSmoke()
        ->click('[aria-label="Toggle navigation"]')
        ->assertVisible('#mobile-primary-navigation')
        ->assertScript(<<<'JS'
            (() => {
                const panel = document.querySelector('#mobile-primary-navigation');

                return panel ? panel.contains(document.activeElement) : false;
            })()
        JS);
});

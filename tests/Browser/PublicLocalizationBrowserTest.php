<?php

use Pest\Browser\Playwright\Playwright;

beforeEach(function () {
    Playwright::setTimeout(12_000);
});

test('public subscriptions page renders russian localized copy after locale switch', function () {
    visit('/subscribe?lang=ru')
        ->assertNoSmoke()
        ->assertSee('Подписка на обновления проекта')
        ->assertSee('Email адрес')
        ->assertSee('Подписаться');
});

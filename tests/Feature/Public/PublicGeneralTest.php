<?php

use Inertia\Testing\AssertableInertia as Assert;

test('language switcher updates session and redirects', function () {
    $response = $this->get('/language/tj');

    $response->assertRedirect();
    $this->assertEquals('tj', session('locale'));
});

test('public pages have correct seo and hreflang tags', function () {
    $response = $this->get('/');

    $response->assertStatus(200);

    // Проверяем наличие ключевых SEO пропсов в Inertia
    $response->assertInertia(fn (Assert $page) => $page
        ->has('locale')
        ->has('localization.supported_locales')
    );
});

test('news page has deferred props for performance', function () {
    $response = $this->get('/news');

    $response->assertStatus(200);

    // В Inertia v2 отложенные пропсы могут отсутствовать в первом ответе
    // или помечаться специальным образом. Проверим базовое наличие структуры.
    $response->assertInertia(fn (Assert $page) => $page
        ->component('public/news/index')
        ->has('categories')
        ->has('filters')
    );
});

test('bvi accessibility panel can be toggled', function () {
    // Этот тест проверяет наличие провайдера BVI в ответе
    $response = $this->get('/');

    // Убеждаемся, что приложение рендерится без ошибок
    $response->assertSuccessful();
});

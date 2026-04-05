<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    Config::set('cache.default', 'array');
    Cache::flush();
});

test('Setting::get reads from cache on second call', function () {
    Setting::create(['key' => 'test_key', 'value' => 'test_value', 'group' => 'test', 'type' => 'string']);

    // First call — populates cache
    $first = Setting::get('test_key');
    expect($first)->toBe('test_value');

    expect(Cache::has('setting:test_key'))->toBeTrue();

    // Second call — should not hit the database
    DB::enableQueryLog();
    $second = Setting::get('test_key');
    $queries = DB::getQueryLog();
    DB::disableQueryLog();

    expect($second)->toBe('test_value');
    expect($queries)->toBeEmpty();
});

test('Setting::set invalidates cache', function () {
    Setting::create(['key' => 'cache_key', 'value' => 'old_value', 'group' => 'test', 'type' => 'string']);

    // Warm up cache
    Setting::get('cache_key');
    expect(Cache::has('setting:cache_key'))->toBeTrue();

    // Update — should invalidate cache
    Setting::set('cache_key', 'new_value');
    expect(Cache::has('setting:cache_key'))->toBeFalse();

    // Next read returns new value
    expect(Setting::get('cache_key'))->toBe('new_value');
});

test('Setting::get returns default when key does not exist', function () {
    expect(Setting::get('nonexistent_key', 'default'))->toBe('default');
});

test('Setting::many returns cached values and per-key defaults', function () {
    Setting::create(['key' => 'site_title', 'value' => 'PIC Portal', 'group' => 'general', 'type' => 'string']);
    Setting::create(['key' => 'contact_email', 'value' => 'info@example.com', 'group' => 'contact', 'type' => 'string']);

    $first = Setting::many([
        'site_title',
        'contact_email',
        'contact_phone',
    ], [
        'contact_phone' => '+992 000 000 000',
    ]);

    expect($first)->toBe([
        'site_title' => 'PIC Portal',
        'contact_email' => 'info@example.com',
        'contact_phone' => '+992 000 000 000',
    ]);

    DB::enableQueryLog();
    $second = Setting::many([
        'site_title',
        'contact_email',
        'contact_phone',
    ], [
        'contact_phone' => '+992 000 000 000',
    ]);
    $queries = DB::getQueryLog();
    DB::disableQueryLog();

    expect($second)->toBe($first);
    expect($queries)->toBeEmpty();
});

test('Setting::many loads uncached keys in a single query', function () {
    Setting::create(['key' => 'site_title', 'value' => 'PIC Portal', 'group' => 'general', 'type' => 'string']);
    Setting::create(['key' => 'contact_email', 'value' => 'info@example.com', 'group' => 'contact', 'type' => 'string']);

    DB::enableQueryLog();
    $settings = Setting::many([
        'site_title',
        'contact_email',
        'contact_phone',
    ], [
        'contact_phone' => '+992 000 000 000',
    ]);
    $queries = DB::getQueryLog();
    DB::disableQueryLog();

    expect($settings)->toBe([
        'site_title' => 'PIC Portal',
        'contact_email' => 'info@example.com',
        'contact_phone' => '+992 000 000 000',
    ]);

    expect($queries)->toHaveCount(1)
        ->and($queries[0]['query'])->toContain('from `settings`');
});

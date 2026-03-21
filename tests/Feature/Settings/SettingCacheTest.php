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

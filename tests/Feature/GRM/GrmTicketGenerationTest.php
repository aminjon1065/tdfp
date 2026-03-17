<?php

use App\Models\GrmCase;
use App\Modules\GRM\Services\GrmService;

beforeEach(function () {
    app()->bind(GrmService::class, fn () => new GrmService(
        app(\App\Modules\GRM\Repositories\GrmRepository::class)
    ));
});

test('ticket number follows GRM-YYYY-NNNNN format', function () {
    $service = app(GrmService::class);

    $case = $service->submit([
        'complainant_name' => 'Test User',
        'email' => 'test@example.com',
        'category' => 'other',
        'description' => 'This is a test grievance submission for format checking.',
    ]);

    expect($case->ticket_number)->toMatch('/^GRM-\d{4}-\d{5}$/');
});

test('ticket number year matches current year', function () {
    $service = app(GrmService::class);

    $case = $service->submit([
        'complainant_name' => 'Test User',
        'email' => 'test@example.com',
        'category' => 'other',
        'description' => 'This is a test grievance submission for year checking.',
    ]);

    $year = date('Y');
    expect($case->ticket_number)->toStartWith("GRM-{$year}-");
});

test('ticket numbers increment sequentially', function () {
    $service = app(GrmService::class);

    $baseData = [
        'complainant_name' => 'Test User',
        'email' => 'test@example.com',
        'category' => 'other',
        'description' => 'This is a test grievance for sequential numbering.',
    ];

    $first = $service->submit($baseData);
    $second = $service->submit($baseData);

    $firstSeq = (int) substr($first->ticket_number, -5);
    $secondSeq = (int) substr($second->ticket_number, -5);

    expect($secondSeq)->toBe($firstSeq + 1);
});

test('ticket sequence starts at 1 when no cases exist for the year', function () {
    $service = app(GrmService::class);

    $case = $service->submit([
        'complainant_name' => 'Test User',
        'email' => 'test@example.com',
        'category' => 'other',
        'description' => 'This is a test grievance for sequence start check.',
    ]);

    expect((int) substr($case->ticket_number, -5))->toBe(1);
});

test('two submissions produce distinct ticket numbers', function () {
    $service = app(GrmService::class);

    $baseData = [
        'complainant_name' => 'Test User',
        'email' => 'test@example.com',
        'category' => 'other',
        'description' => 'Concurrent submission test grievance description.',
    ];

    $cases = collect(range(1, 5))->map(fn () => $service->submit($baseData));

    $tickets = $cases->pluck('ticket_number');
    expect($tickets->unique()->count())->toBe(5);
});

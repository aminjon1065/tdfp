<?php

test('grm submission is rate limited to 5 per minute per ip', function () {
    $payload = [
        'complainant_name' => 'Test User',
        'email' => 'test@example.com',
        'category' => 'other',
        'description' => 'Rate limit test grievance submission description.',
    ];

    // First 5 requests should pass (or fail validation/redirect — not 429)
    foreach (range(1, 5) as $i) {
        $response = $this->post(route('grm.store'), $payload);
        expect($response->status())->not->toBe(429);
    }

    // 6th request should be rate limited
    $response = $this->post(route('grm.store'), $payload);
    expect($response->status())->toBe(429);
});

test('grm track search is rate limited to 20 per minute per ip', function () {
    $payload = ['ticket_number' => 'GRM-2026-00001'];

    foreach (range(1, 20) as $i) {
        $response = $this->post(route('grm.track.search'), $payload);
        expect($response->status())->not->toBe(429);
    }

    $response = $this->post(route('grm.track.search'), $payload);
    expect($response->status())->toBe(429);
});

<?php

test('starter dashboard route is not available', function () {
    $this->get('/dashboard')->assertNotFound();
});

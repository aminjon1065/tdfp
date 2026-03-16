<?php

namespace App\Core\Services;

use App\Core\Repositories\BaseRepository;

abstract class BaseService
{
    public function __construct(protected BaseRepository $repository) {}
}

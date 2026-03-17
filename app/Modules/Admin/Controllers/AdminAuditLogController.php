<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuditLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/audit-logs/index', [
            'logs' => AuditLog::with('user')->latest('created_at')->paginate(50),
        ]);
    }
}

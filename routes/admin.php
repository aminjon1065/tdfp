<?php

use App\Modules\Activities\Controllers\AdminActivityController;
use App\Modules\Admin\Controllers\AdminDashboardController;
use App\Modules\CMS\Controllers\AdminPageController;
use App\Modules\Documents\Controllers\AdminDocumentController;
use App\Modules\GRM\Controllers\AdminGrmController;
use App\Modules\Media\Controllers\AdminMediaController;
use App\Modules\News\Controllers\AdminNewsController;
use App\Modules\Procurement\Controllers\AdminProcurementController;
use App\Modules\Settings\Controllers\AdminSettingController;
use App\Modules\Users\Controllers\AdminUserController;
use Illuminate\Support\Facades\Route;

Route::middleware([
    'auth',
    'verified',
    'role_or_permission:super_admin|editor|content_manager|procurement_officer|grm_officer|pages.view|news.view|activities.view|documents.view|procurement.view|media.view|users.view|settings.view|audit_logs.view|grm.view',
])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // CMS Pages
    Route::resource('pages', AdminPageController::class)->except(['show']);

    // News
    Route::resource('news', AdminNewsController::class)->except(['show']);

    // Activities
    Route::resource('activities', AdminActivityController::class)->except(['show']);

    // Documents
    Route::resource('documents', AdminDocumentController::class)->except(['show']);

    // Procurement
    Route::resource('procurement', AdminProcurementController::class)->except(['show']);

    // Media
    Route::get('media', [AdminMediaController::class, 'index'])->name('media.index');
    Route::get('media/create', [AdminMediaController::class, 'create'])->name('media.create');
    Route::post('media', [AdminMediaController::class, 'store'])->name('media.store');
    Route::delete('media/{mediaItem}', [AdminMediaController::class, 'destroy'])->name('media.destroy');

    // GRM Cases
    Route::get('grm', [AdminGrmController::class, 'index'])->name('grm.index');
    Route::get('grm/{grmCase}', [AdminGrmController::class, 'show'])->name('grm.show');
    Route::patch('grm/{grmCase}/status', [AdminGrmController::class, 'updateStatus'])->name('grm.update-status');
    Route::post('grm/{grmCase}/messages', [AdminGrmController::class, 'addMessage'])->name('grm.add-message');

    // Users
    Route::resource('users', AdminUserController::class)->except(['show']);

    // Settings
    Route::get('settings', [AdminSettingController::class, 'index'])
        ->middleware('permission:settings.view')
        ->name('settings.index');
    Route::post('settings', [AdminSettingController::class, 'update'])
        ->middleware('permission:settings.edit')
        ->name('settings.update');

    // Audit Logs
    Route::get('audit-logs', function () {
        return \Inertia\Inertia::render('admin/audit-logs/index', [
            'logs' => \App\Models\AuditLog::with('user')->latest('created_at')->paginate(50),
        ]);
    })->middleware('permission:audit_logs.view')->name('audit-logs.index');
});

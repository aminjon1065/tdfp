<?php

use App\Http\Controllers\PublicController;
use App\Http\Controllers\SitemapController;
use App\Modules\Activities\Controllers\PublicActivityController;
use App\Modules\CMS\Controllers\PublicPageController;
use App\Modules\Documents\Controllers\PublicDocumentController;
use App\Modules\GRM\Controllers\PublicGrmController;
use App\Modules\Media\Controllers\PublicMediaController;
use App\Modules\News\Controllers\PublicNewsController;
use App\Modules\Procurement\Controllers\PublicProcurementController;
use App\Modules\Search\Controllers\SearchController;
use App\Modules\Staff\Controllers\PublicStaffController;
use App\Modules\Subscriptions\Controllers\PublicSubscriptionController;
use Illuminate\Support\Facades\Route;

// Language switcher
Route::get('/language/{locale}', function (string $locale) {
    if (in_array($locale, config('app.supported_locales'))) {
        session(['locale' => $locale]);
    }

    return redirect()->back();
})->name('language.switch');

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

// Public website
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/contact', [PublicController::class, 'contact'])->name('contact');
Route::get('/team', [PublicStaffController::class, 'index'])->name('team.index');
Route::get('/subscribe', [PublicSubscriptionController::class, 'show'])->name('subscriptions.show');
Route::post('/subscribe', [PublicSubscriptionController::class, 'store'])->middleware('throttle:5,1')->name('subscriptions.store');
Route::get('/subscribe/confirm/{subscriber}', [PublicSubscriptionController::class, 'confirmReview'])->name('subscriptions.confirm');
Route::post('/subscribe/confirm/{subscriber}', [PublicSubscriptionController::class, 'confirm'])->middleware('throttle:5,1')->name('subscriptions.confirm.process');
Route::get('/subscribe/unsubscribe/{subscriber}', [PublicSubscriptionController::class, 'unsubscribeReview'])->name('subscriptions.unsubscribe');
Route::post('/subscribe/unsubscribe/{subscriber}', [PublicSubscriptionController::class, 'unsubscribe'])->middleware('throttle:5,1')->name('subscriptions.unsubscribe.process');

// CMS static pages
Route::get('/about', [PublicPageController::class, 'show'])->defaults('slug', 'about')->name('about');
Route::get('/project', [PublicPageController::class, 'show'])->defaults('slug', 'project')->name('project');
Route::get('/pages/{slug}', [PublicPageController::class, 'show'])->name('pages.show');

// Activities
Route::get('/activities', [PublicActivityController::class, 'index'])->name('activities.index');
Route::get('/activities/{slug}', [PublicActivityController::class, 'show'])->name('activities.show');

// News
Route::get('/news', [PublicNewsController::class, 'index'])->name('news.index');
Route::get('/news/{slug}', [PublicNewsController::class, 'show'])->name('news.show');

// Documents
Route::get('/documents', [PublicDocumentController::class, 'index'])->name('documents.index');
Route::get('/documents/{document}/download', [PublicDocumentController::class, 'download'])->name('documents.download');

// Procurement
Route::get('/procurement', [PublicProcurementController::class, 'index'])->name('procurement.index');
Route::get('/procurement/{ref}', [PublicProcurementController::class, 'show'])->name('procurement.show');

// Media
Route::get('/media', [PublicMediaController::class, 'index'])->name('media.index');

// GRM
Route::get('/grm', [PublicGrmController::class, 'index'])->name('grm.index');
Route::get('/grm/submit', [PublicGrmController::class, 'submit'])->name('grm.submit');
Route::post('/grm/submit', [PublicGrmController::class, 'store'])->middleware('throttle:5,1')->name('grm.store');
Route::get('/grm/submitted/{ticket}', [PublicGrmController::class, 'submitted'])->name('grm.submitted');
Route::get('/grm/track', [PublicGrmController::class, 'track'])->name('grm.track');
Route::post('/grm/track', [PublicGrmController::class, 'trackSearch'])->middleware('throttle:20,1')->name('grm.track.search');

// Search
Route::get('/search', [SearchController::class, 'index'])->name('search');

// Auth / Settings (from Fortify)
require __DIR__.'/settings.php';

require __DIR__.'/admin.php';

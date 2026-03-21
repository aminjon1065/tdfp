<?php

namespace App\Modules\Subscriptions\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Subscriptions\Repositories\SubscriptionRepository;
use App\Modules\Subscriptions\Services\SubscriptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminSubscriptionController extends Controller
{
    public function __construct(
        private SubscriptionRepository $repository,
        private SubscriptionService $service,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()?->hasPermissionTo('subscriptions.view'), 403);

        return Inertia::render('admin/subscriptions/index', [
            'subscribers' => $this->repository->paginate(20, $request->only('status', 'search')),
            'filters' => $request->only('status', 'search'),
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        abort_unless($request->user()?->hasPermissionTo('subscriptions.view'), 403);

        $subscribers = $this->repository->paginate(1000, $request->only('status', 'search'))->getCollection();

        return response()->streamDownload(function () use ($subscribers): void {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['email', 'status', 'locale', 'confirmed_at', 'unsubscribed_at']);

            foreach ($subscribers as $subscriber) {
                fputcsv($handle, [
                    $subscriber->email,
                    $subscriber->status,
                    $subscriber->locale,
                    optional($subscriber->confirmed_at)->toDateTimeString(),
                    optional($subscriber->unsubscribed_at)->toDateTimeString(),
                ]);
            }

            fclose($handle);
        }, 'email-subscribers.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}

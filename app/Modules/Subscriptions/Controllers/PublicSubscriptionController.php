<?php

namespace App\Modules\Subscriptions\Controllers;

use App\Http\Controllers\Controller;
use App\Models\EmailSubscriber;
use App\Modules\Subscriptions\Requests\StoreSubscriptionRequest;
use App\Modules\Subscriptions\Services\SubscriptionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicSubscriptionController extends Controller
{
    public function __construct(private SubscriptionService $service) {}

    public function show(Request $request): Response
    {
        return Inertia::render('public/subscriptions/show', [
            'subscriptionStatus' => $request->query('status'),
        ]);
    }

    public function store(StoreSubscriptionRequest $request): RedirectResponse
    {
        $subscriber = $this->service->subscribe(
            email: $request->string('email')->value(),
            locale: $request->string('locale')->value() ?: app()->getLocale(),
            ipAddress: $request->ip(),
        );

        $status = $subscriber->status === 'active'
            ? 'already-active'
            : 'confirmation-sent';

        return redirect()->route('subscriptions.show', ['status' => $status]);
    }

    public function confirm(Request $request, EmailSubscriber $subscriber): RedirectResponse
    {
        abort_unless($request->hasValidSignature(), 403);

        $confirmed = $this->service->confirm(
            $subscriber,
            $request->string('token')->value(),
            $request->ip(),
        );

        return redirect()->route('subscriptions.show', [
            'status' => $confirmed ? 'confirmed' : 'invalid-confirmation',
        ]);
    }

    public function unsubscribe(Request $request, EmailSubscriber $subscriber): RedirectResponse
    {
        abort_unless($request->hasValidSignature(), 403);

        $unsubscribed = $this->service->unsubscribe(
            $subscriber,
            $request->string('token')->value(),
            $request->ip(),
        );

        return redirect()->route('subscriptions.show', [
            'status' => $unsubscribed ? 'unsubscribed' : 'invalid-unsubscribe',
        ]);
    }
}

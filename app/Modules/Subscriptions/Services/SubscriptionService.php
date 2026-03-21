<?php

namespace App\Modules\Subscriptions\Services;

use App\Mail\SubscriptionConfirmationMail;
use App\Models\EmailSubscriber;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class SubscriptionService
{
    public function subscribe(string $email, string $locale, ?string $ipAddress): EmailSubscriber
    {
        $subscriber = EmailSubscriber::query()->firstOrNew([
            'email' => Str::lower(trim($email)),
        ]);

        if ($subscriber->status === 'active') {
            return $subscriber;
        }

        $subscriber->fill([
            'status' => 'pending',
            'locale' => $locale,
            'source' => 'public_form',
            'confirmation_token' => Str::random(64),
            'unsubscribe_token' => null,
            'subscribed_ip' => $ipAddress,
            'confirmed_ip' => null,
            'unsubscribed_ip' => null,
            'confirmation_sent_at' => now(),
            'confirmed_at' => null,
            'unsubscribed_at' => null,
        ]);
        $subscriber->save();

        Mail::to($subscriber->email)->queue(
            (new SubscriptionConfirmationMail(
                confirmationUrl: $this->confirmationUrl($subscriber),
                email: $subscriber->email,
            ))->afterCommit()
        );

        return $subscriber;
    }

    public function confirm(EmailSubscriber $subscriber, string $token, ?string $ipAddress): bool
    {
        if ($subscriber->status === 'active') {
            return true;
        }

        if ($subscriber->status !== 'pending' || ! hash_equals((string) $subscriber->confirmation_token, $token)) {
            return false;
        }

        $subscriber->update([
            'status' => 'active',
            'confirmation_token' => null,
            'unsubscribe_token' => Str::random(64),
            'confirmed_at' => now(),
            'confirmed_ip' => $ipAddress,
        ]);

        return true;
    }

    public function unsubscribe(EmailSubscriber $subscriber, string $token, ?string $ipAddress): bool
    {
        if ($subscriber->status === 'unsubscribed') {
            return true;
        }

        if (! hash_equals((string) $subscriber->unsubscribe_token, $token)) {
            return false;
        }

        $subscriber->update([
            'status' => 'unsubscribed',
            'unsubscribed_at' => now(),
            'unsubscribed_ip' => $ipAddress,
        ]);

        return true;
    }

    public function confirmationUrl(EmailSubscriber $subscriber): string
    {
        return URL::temporarySignedRoute(
            'subscriptions.confirm',
            now()->addDays(2),
            [
                'subscriber' => $subscriber->getKey(),
                'token' => $subscriber->confirmation_token,
            ],
        );
    }

    public function unsubscribeUrl(EmailSubscriber $subscriber): ?string
    {
        if (! $subscriber->unsubscribe_token) {
            return null;
        }

        return URL::signedRoute('subscriptions.unsubscribe', [
            'subscriber' => $subscriber->getKey(),
            'token' => $subscriber->unsubscribe_token,
        ]);
    }
}

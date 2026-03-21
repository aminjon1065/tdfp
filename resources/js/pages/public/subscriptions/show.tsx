import PublicLayout from '@/layouts/public-layout';
import { t } from '@/lib/i18n';
import { Head, useForm, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const statusMessages: Record<string, { tone: string; title: string; body: string }> = {
    'confirmation-sent': {
        tone: 'border-blue-200 bg-blue-50 text-blue-900',
        title: 'Check your email',
        body: 'We sent a confirmation link to activate your subscription.',
    },
    confirmed: {
        tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
        title: 'Subscription confirmed',
        body: 'You are now subscribed to project updates.',
    },
    unsubscribed: {
        tone: 'border-slate-200 bg-slate-50 text-slate-900',
        title: 'You have been unsubscribed',
        body: 'You will no longer receive project update emails.',
    },
    'already-active': {
        tone: 'border-amber-200 bg-amber-50 text-amber-900',
        title: 'Already subscribed',
        body: 'This email address is already active in the mailing list.',
    },
    'invalid-confirmation': {
        tone: 'border-red-200 bg-red-50 text-red-900',
        title: 'Confirmation link is invalid',
        body: 'Request a new subscription confirmation if you still want to join the list.',
    },
    'invalid-unsubscribe': {
        tone: 'border-red-200 bg-red-50 text-red-900',
        title: 'Unsubscribe link is invalid',
        body: 'The management link is no longer valid.',
    },
};

export default function SubscriptionPage({
    subscriptionStatus,
}: {
    subscriptionStatus?: string | null;
}) {
    const locale = (usePage().props as any).locale ?? 'en';
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        locale,
    });

    const statusMessage = subscriptionStatus ? statusMessages[subscriptionStatus] : null;

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        post('/subscribe');
    }

    return (
        <PublicLayout
            title={t(locale, 'subscriptions.title')}
            description={t(locale, 'subscriptions.description')}
            seoType="website"
        >
            <Head title={t(locale, 'subscriptions.title')} />
            <div className="container mx-auto max-w-3xl px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {t(locale, 'subscriptions.heading')}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {t(locale, 'subscriptions.description')}
                    </p>
                </div>

                {statusMessage && (
                    <div className={`mb-6 rounded-xl border px-4 py-4 ${statusMessage.tone}`}>
                        <p className="font-semibold">{statusMessage.title}</p>
                        <p className="mt-1 text-sm">{statusMessage.body}</p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="subscription-email">{t(locale, 'subscriptions.emailLabel')}</Label>
                        <Input
                            id="subscription-email"
                            type="email"
                            autoComplete="email"
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {t(locale, 'subscriptions.notice')}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? t(locale, 'subscriptions.submitting') : t(locale, 'subscriptions.submit')}
                    </Button>
                </form>
            </div>
        </PublicLayout>
    );
}

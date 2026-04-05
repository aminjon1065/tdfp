import { Head, useForm, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/public-layout';
import { t } from '@/lib/i18n';

const statusTones: Record<string, string> = {
    'confirmation-sent': 'border-blue-200 bg-blue-50 text-blue-900',
    confirmed: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    unsubscribed: 'border-slate-200 bg-slate-50 text-slate-900',
    'already-active': 'border-amber-200 bg-amber-50 text-amber-900',
    'invalid-confirmation': 'border-red-200 bg-red-50 text-red-900',
    'invalid-unsubscribe': 'border-red-200 bg-red-50 text-red-900',
};

export default function SubscriptionPage({
    subscriptionStatus,
    subscriptionAction,
}: {
    subscriptionStatus?: string | null;
    subscriptionAction?: {
        intent: 'confirm' | 'unsubscribe';
        email: string;
        action_url: string;
    } | null;
}) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        locale,
    });
    const actionForm = useForm({});

    const statusTone = subscriptionStatus
        ? statusTones[subscriptionStatus]
        : null;
    const statusMessage = subscriptionStatus
        ? {
              title: t(
                  locale,
                  `subscriptions.status.${subscriptionStatus}.title`,
              ),
              body: t(
                  locale,
                  `subscriptions.status.${subscriptionStatus}.body`,
              ),
          }
        : null;
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SubscribeAction',
        name: t(locale, 'subscriptions.title'),
        description: t(locale, 'subscriptions.description'),
        inLanguage: locale,
        target: currentUrl || undefined,
    };

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        post('/subscribe');
    }

    return (
        <PublicLayout
            title={t(locale, 'subscriptions.title')}
            description={t(locale, 'subscriptions.description')}
            structuredData={structuredData}
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

                {subscriptionAction && (
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold tracking-[0.14em] text-slate-500 uppercase">
                            {subscriptionAction.intent === 'confirm'
                                ? t(locale, 'subscriptions.confirmRequest')
                                : t(locale, 'subscriptions.unsubscribeRequest')}
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                            {subscriptionAction.intent === 'confirm'
                                ? t(locale, 'subscriptions.confirmReviewTitle')
                                : t(
                                      locale,
                                      'subscriptions.unsubscribeReviewTitle',
                                  )}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {subscriptionAction.intent === 'confirm'
                                ? `${t(locale, 'subscriptions.confirmReviewBodyPrefix')} ${subscriptionAction.email}.`
                                : `${t(locale, 'subscriptions.unsubscribeReviewBodyPrefix')} ${subscriptionAction.email}.`}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <Button
                                type="button"
                                disabled={actionForm.processing}
                                onClick={() =>
                                    actionForm.post(
                                        subscriptionAction.action_url,
                                    )
                                }
                            >
                                {actionForm.processing
                                    ? t(locale, 'subscriptions.processing')
                                    : subscriptionAction.intent === 'confirm'
                                      ? t(locale, 'subscriptions.confirmAction')
                                      : t(
                                            locale,
                                            'subscriptions.unsubscribeAction',
                                        )}
                            </Button>
                        </div>
                    </div>
                )}

                {statusMessage && statusTone && (
                    <div
                        className={`mb-6 rounded-xl border px-4 py-4 ${statusTone}`}
                    >
                        <p className="font-semibold">{statusMessage.title}</p>
                        <p className="mt-1 text-sm">{statusMessage.body}</p>
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    noValidate
                >
                    <div className="space-y-2">
                        <Label htmlFor="subscription-email">
                            {t(locale, 'subscriptions.emailLabel')}
                        </Label>
                        <Input
                            id="subscription-email"
                            type="email"
                            autoComplete="email"
                            value={data.email}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {t(locale, 'subscriptions.notice')}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing
                            ? t(locale, 'subscriptions.submitting')
                            : t(locale, 'subscriptions.submit')}
                    </Button>
                </form>
            </div>
        </PublicLayout>
    );
}

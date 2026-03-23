import { Button } from '@/components/ui/button';
import PageHero from '@/components/page-hero';
import PublicLayout from '@/layouts/public-layout';
import { Link, usePage } from '@inertiajs/react';
import { t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';
import { CheckCircle } from 'lucide-react';

export default function GrmSubmitted({ ticket, trackingToken }: { ticket: string; trackingToken: string }) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const publicHref = (path: string) => localizedPublicHref(path, locale, defaultLocale);
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t(locale, 'grm.submittedPageTitle'),
        description: t(locale, 'grm.description'),
        inLanguage: locale,
        url: currentUrl || undefined,
    };

    return (
        <PublicLayout
            title={t(locale, 'grm.submittedPageTitle')}
            description={t(locale, 'grm.description')}
            structuredData={structuredData}
            seoType="website"
            noIndex
            blendHeader
        >
            <PageHero
                title={t(locale, 'grm.submittedPageTitle')}
                subtitle={t(locale, 'grm.title')}
                description={t(locale, 'grm.submittedLead')}
                compact
            />
            <div className="container mx-auto max-w-lg px-4 py-20 text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" aria-hidden="true" />
                <p className="mb-4 text-gray-600" role="status" aria-live="polite">{t(locale, 'grm.submittedEmailNotice')}</p>
                <section aria-labelledby="tracking-details-heading" className="mb-8 rounded-lg border bg-gray-50 p-4">
                    <h2 id="tracking-details-heading" className="sr-only">
                        {t(locale, 'grm.trackingDetails')}
                    </h2>
                    <dl className="space-y-4">
                    <div>
                        <dt className="text-sm text-gray-500">{t(locale, 'grm.ticketNumberLabel')}</dt>
                        <dd className="mt-1 text-2xl font-mono font-bold text-blue-700">{ticket}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-gray-500">{t(locale, 'grm.trackingTokenLabel')}</dt>
                        <dd className="mt-1 break-all text-xl font-mono font-bold text-slate-800">{trackingToken}</dd>
                    </div>
                    </dl>
                    <p className="mt-1 text-xs text-gray-400">{t(locale, 'grm.trackingSaveNotice')}</p>
                </section>
                <div className="flex gap-3 justify-center">
                    <Button asChild>
                        <Link href={publicHref('/grm/track')}>{t(locale, 'grm.trackStatusAction')}</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={publicHref('/')}>{t(locale, 'common.returnHome')}</Link>
                    </Button>
                </div>
            </div>
        </PublicLayout>
    );
}

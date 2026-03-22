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
        name: 'GRM Submission Confirmation',
        description: t(locale, 'grm.description'),
        inLanguage: locale,
        url: currentUrl || undefined,
    };

    return (
        <PublicLayout
            title="Complaint Submitted"
            description={t(locale, 'grm.description')}
            structuredData={structuredData}
            seoType="website"
            noIndex
            blendHeader
        >
            <PageHero
                title="Complaint Submitted"
                subtitle={t(locale, 'grm.title')}
                description="Your complaint has been received. Keep your tracking details to follow the case securely."
                compact
            />
            <div className="container mx-auto max-w-lg px-4 py-20 text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" aria-hidden="true" />
                <p className="mb-4 text-gray-600" role="status" aria-live="polite">Your complaint has been received. A confirmation email has been sent.</p>
                <section aria-labelledby="tracking-details-heading" className="mb-8 rounded-lg border bg-gray-50 p-4">
                    <h2 id="tracking-details-heading" className="sr-only">
                        Tracking details
                    </h2>
                    <dl className="space-y-4">
                    <div>
                        <dt className="text-sm text-gray-500">Your ticket number:</dt>
                        <dd className="mt-1 text-2xl font-mono font-bold text-blue-700">{ticket}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-gray-500">Your tracking token:</dt>
                        <dd className="mt-1 break-all text-xl font-mono font-bold text-slate-800">{trackingToken}</dd>
                    </div>
                    </dl>
                    <p className="mt-1 text-xs text-gray-400">Save both values to track your complaint status securely.</p>
                </section>
                <div className="flex gap-3 justify-center">
                    <Button asChild>
                        <Link href={publicHref('/grm/track')}>Track Status</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={publicHref('/')}>Return Home</Link>
                    </Button>
                </div>
            </div>
        </PublicLayout>
    );
}

import PublicLayout from '@/layouts/public-layout';
import PageHero from '@/components/page-hero';
import { t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';
import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { MessageCircle, Search, Shield } from 'lucide-react';

export default function GrmIndex() {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const publicHref = (path: string) => localizedPublicHref(path, locale, defaultLocale);
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t(locale, 'grm.title'),
        description: t(locale, 'grm.description'),
        inLanguage: locale,
        url: currentUrl || undefined,
    };

    return (
        <PublicLayout
            title={t(locale, 'grm.title')}
            description={t(locale, 'grm.description')}
            structuredData={structuredData}
            seoType="website"
            blendHeader
        >
            <PageHero
                title="Grievance Redress Mechanism"
                subtitle={t(locale, 'grm.title')}
                description="The GRM provides a transparent, accessible, and accountable process for project-affected people to raise concerns and grievances."
                compact
            />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <ul className="mb-10 grid gap-6 sm:grid-cols-3">
                    <li>
                        <article className="rounded-xl border p-6 text-center transition-colors hover:border-blue-300">
                            <MessageCircle className="mx-auto mb-3 h-8 w-8 text-orange-600" aria-hidden="true" />
                            <h2 className="mb-2 font-semibold">Submit Complaint</h2>
                            <p className="mb-4 text-sm text-gray-500">Have a grievance? Submit it online for review.</p>
                            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                                <Link href={publicHref('/grm/submit')}>Submit Now</Link>
                            </Button>
                        </article>
                    </li>
                    <li>
                        <article className="rounded-xl border p-6 text-center transition-colors hover:border-blue-300">
                            <Search className="mx-auto mb-3 h-8 w-8 text-blue-600" aria-hidden="true" />
                            <h2 className="mb-2 font-semibold">Track Your Case</h2>
                            <p className="mb-4 text-sm text-gray-500">Check the status of your existing complaint.</p>
                            <Button asChild variant="outline" className="w-full">
                                <Link href={publicHref('/grm/track')}>Track Case</Link>
                            </Button>
                        </article>
                    </li>
                    <li>
                        <article className="rounded-xl border p-6 text-center transition-colors hover:border-blue-300">
                            <Shield className="mx-auto mb-3 h-8 w-8 text-green-600" aria-hidden="true" />
                            <h2 className="mb-2 font-semibold">GRM Policy</h2>
                            <p className="mb-4 text-sm text-gray-500">Learn about our grievance handling process.</p>
                            <Button asChild variant="outline" className="w-full">
                                <Link href={publicHref('/pages/grm-policy')}>Read Policy</Link>
                            </Button>
                        </article>
                    </li>
                </ul>

                <div className="rounded-xl bg-blue-50 border border-blue-200 p-6">
                    <h2 className="font-semibold text-blue-900 mb-2">Complaint Categories</h2>
                    <ul className="grid sm:grid-cols-2 gap-2 text-sm text-blue-800">
                        <li>• Procurement issues</li>
                        <li>• Project implementation concerns</li>
                        <li>• Environmental and social impacts</li>
                        <li>• Corruption allegations</li>
                        <li>• Other project-related concerns</li>
                    </ul>
                </div>
            </div>
        </PublicLayout>
    );
}

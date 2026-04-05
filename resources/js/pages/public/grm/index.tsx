import { Link, usePage } from '@inertiajs/react';
import { MessageCircle, Search, Shield } from 'lucide-react';

import PageHero from '@/components/page-hero';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';

export default function GrmIndex() {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const publicHref = (path: string) =>
        localizedPublicHref(path, locale, defaultLocale);
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
                title={t(locale, 'grm.title')}
                subtitle={t(locale, 'grm.title')}
                description={t(locale, 'grm.indexLead')}
                compact
            />
            <div className="container mx-auto max-w-4xl px-4 py-12">
                <ul className="mb-10 grid gap-6 sm:grid-cols-3">
                    <li>
                        <article className="rounded-xl border p-6 text-center transition-colors hover:border-blue-300">
                            <MessageCircle
                                className="mx-auto mb-3 h-8 w-8 text-orange-600"
                                aria-hidden="true"
                            />
                            <h2 className="mb-2 font-semibold">
                                {t(locale, 'grm.cardSubmitTitle')}
                            </h2>
                            <p className="mb-4 text-sm text-gray-500">
                                {t(locale, 'grm.cardSubmitDescription')}
                            </p>
                            <Button
                                asChild
                                className="w-full bg-orange-600 hover:bg-orange-700"
                            >
                                <Link href={publicHref('/grm/submit')}>
                                    {t(locale, 'grm.cardSubmitAction')}
                                </Link>
                            </Button>
                        </article>
                    </li>
                    <li>
                        <article className="rounded-xl border p-6 text-center transition-colors hover:border-blue-300">
                            <Search
                                className="mx-auto mb-3 h-8 w-8 text-blue-600"
                                aria-hidden="true"
                            />
                            <h2 className="mb-2 font-semibold">
                                {t(locale, 'grm.cardTrackTitle')}
                            </h2>
                            <p className="mb-4 text-sm text-gray-500">
                                {t(locale, 'grm.cardTrackDescription')}
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                            >
                                <Link href={publicHref('/grm/track')}>
                                    {t(locale, 'grm.cardTrackAction')}
                                </Link>
                            </Button>
                        </article>
                    </li>
                    <li>
                        <article className="rounded-xl border p-6 text-center transition-colors hover:border-blue-300">
                            <Shield
                                className="mx-auto mb-3 h-8 w-8 text-green-600"
                                aria-hidden="true"
                            />
                            <h2 className="mb-2 font-semibold">
                                {t(locale, 'grm.cardPolicyTitle')}
                            </h2>
                            <p className="mb-4 text-sm text-gray-500">
                                {t(locale, 'grm.cardPolicyDescription')}
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                            >
                                <Link href={publicHref('/pages/grm-policy')}>
                                    {t(locale, 'grm.cardPolicyAction')}
                                </Link>
                            </Button>
                        </article>
                    </li>
                </ul>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                    <h2 className="mb-2 font-semibold text-blue-900">
                        {t(locale, 'grm.categoriesTitle')}
                    </h2>
                    <ul className="grid gap-2 text-sm text-blue-800 sm:grid-cols-2">
                        <li>{`• ${t(locale, 'grm.category.procurement')}`}</li>
                        <li>{`• ${t(locale, 'grm.category.project_implementation')}`}</li>
                        <li>{`• ${t(locale, 'grm.category.environment_social')}`}</li>
                        <li>{`• ${t(locale, 'grm.category.corruption')}`}</li>
                        <li>{`• ${t(locale, 'grm.category.other')}`}</li>
                    </ul>
                </div>
            </div>
        </PublicLayout>
    );
}

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageHero from '@/components/page-hero';
import PublicImage from '@/components/public-image';
import PublicLayout from '@/layouts/public-layout';
import { getStatusLabel, getTranslation, t } from '@/lib/i18n';
import { localizedPublicHref, publicLocaleQuery } from '@/lib/public-locale';
import { Link, router, usePage } from '@inertiajs/react';
import { SearchX } from 'lucide-react';

const DOMAINS = [
    { slug: 'digital-infrastructure', labelKey: 'nav.domain1', color: 'bg-slate-100 text-slate-700' },
    { slug: 'digital-public-services', labelKey: 'nav.domain2', color: 'bg-blue-100 text-blue-700' },
    { slug: 'digital-identity-payments', labelKey: 'nav.domain3', color: 'bg-indigo-100 text-indigo-700' },
    { slug: 'cybersecurity', labelKey: 'nav.domain4', color: 'bg-red-100 text-red-700' },
    { slug: 'legal-governance', labelKey: 'nav.domain5', color: 'bg-amber-100 text-amber-700' },
    { slug: 'digital-skills', labelKey: 'nav.domain6', color: 'bg-green-100 text-green-700' },
    { slug: 'school-connectivity', labelKey: 'nav.domain7', color: 'bg-teal-100 text-teal-700' },
] as const;

function getDomainColor(slug: string | null | undefined): string {
    const domain = DOMAINS.find((d) => d.slug === slug);
    return domain ? domain.color : 'bg-slate-100 text-slate-600';
}

function getDomainLabel(slug: string | null | undefined, locale: string, tFn: (l: string, k: string) => string): string {
    const domain = DOMAINS.find((d) => d.slug === slug);
    return domain ? tFn(locale, domain.labelKey) : '';
}

export default function ActivitiesIndex({ activities, filters }: { activities: any; filters: any }) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const localeQuery = publicLocaleQuery(locale, defaultLocale);
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: t(locale, 'activities.title'),
            description: t(locale, 'activities.description'),
            inLanguage: locale,
            url: currentUrl || undefined,
        },
    ];

    function applyFilter(updates: Record<string, string>) {
        const params: Record<string, string> = { ...localeQuery };
        if (filters.status) params.status = filters.status;
        if (filters.domain) params.domain = filters.domain;
        Object.assign(params, updates);
        // Remove empty values
        Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
        router.get('/activities', params);
    }

    return (
        <PublicLayout
            title={t(locale, 'nav.activities')}
            description={t(locale, 'activities.description')}
            structuredData={structuredData}
            blendHeader
        >
            <PageHero
                title={t(locale, 'activities.title')}
                subtitle={t(locale, 'nav.activities')}
                description={t(locale, 'activities.description')}
                compact
                breadcrumbs={[
                    { label: t(locale, 'nav.home'), href: localizedPublicHref('/', locale, defaultLocale) },
                    { label: t(locale, 'activities.title') },
                ]}
            />

            <div className="container mx-auto px-4 py-10">
                {/* Domain filter tabs */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant={!filters.domain ? 'default' : 'outline'}
                            onClick={() => applyFilter({ domain: '' })}
                        >
                            {t(locale, 'common.all')}
                        </Button>
                        {DOMAINS.map((domain) => (
                            <Button
                                key={domain.slug}
                                size="sm"
                                variant={filters.domain === domain.slug ? 'default' : 'outline'}
                                onClick={() => applyFilter({ domain: domain.slug })}
                            >
                                {t(locale, domain.labelKey)}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Status filter */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {['', 'planned', 'in_progress', 'completed'].map((status) => (
                        <Button
                            key={status}
                            variant={filters.status === status || (!status && !filters.status) ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => applyFilter({ status })}
                            className="text-xs"
                        >
                            {status ? getStatusLabel(status, locale) : t(locale, 'common.all')}
                        </Button>
                    ))}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {activities.data.map((activity: any) => {
                        const translation = getTranslation(activity, locale);
                        const domainLabel = getDomainLabel(activity.domain_slug, locale, t);
                        const domainColor = getDomainColor(activity.domain_slug);

                        return (
                            <article
                                key={activity.id}
                                className="gov-panel flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
                            >
                                {activity.featured_image && (
                                    <div className="aspect-video overflow-hidden bg-gray-100">
                                        <PublicImage
                                            src={`/storage/${activity.featured_image}`}
                                            alt={translation.title}
                                            className="h-full w-full object-cover"
                                            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-1 flex-col p-5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {activity.activity_number && (
                                            <span className="text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
                                                Activity {String(activity.activity_number).padStart(2, '0')}
                                            </span>
                                        )}
                                        {domainLabel && (
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${domainColor}`}>
                                                {domainLabel}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge
                                            variant={
                                                activity.status === 'completed' ? 'outline' :
                                                activity.status === 'in_progress' ? 'default' : 'secondary'
                                            }
                                            className="w-fit text-xs"
                                        >
                                            {getStatusLabel(activity.status, locale)}
                                        </Badge>
                                    </div>
                                    <h3 className="mt-3 text-base font-semibold text-[var(--public-primary-hover)] leading-snug">
                                        {translation.title}
                                    </h3>
                                    <p className="mt-2 flex-1 text-sm text-slate-500 line-clamp-3 leading-6">
                                        {translation.description}
                                    </p>
                                    <Link
                                        href={`/activities/${activity.slug}`}
                                        className="mt-4 text-sm font-medium text-[var(--public-accent)] hover:underline"
                                    >
                                        {t(locale, 'common.learnMore')} →
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {activities.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <SearchX className="h-7 w-7" />
                        </div>
                        <p className="text-base font-semibold text-slate-700">{t(locale, 'activities.empty')}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-5"
                            onClick={() => applyFilter({ domain: '', status: '' })}
                        >
                            {t(locale, 'activities.resetFilters')}
                        </Button>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

import { Badge } from '@/components/ui/badge';
import PageHero from '@/components/page-hero';
import PublicImage from '@/components/public-image';
import SocialShare from '@/components/social-share';
import PublicLayout from '@/layouts/public-layout';
import { getStatusLabel, getTranslation, t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, ChevronRight } from 'lucide-react';

export default function ActivityShow({ activity }: { activity: any }) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const publicHref = (path: string) => localizedPublicHref(path, locale, defaultLocale);
    const translation = getTranslation(activity, locale);
    const imageUrl = activity.featured_image && currentUrl
        ? new URL(`/storage/${activity.featured_image}`, currentUrl).toString()
        : undefined;
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: translation.title ?? t(locale, 'activities.title'),
            description: translation.description ?? undefined,
            inLanguage: locale,
            url: currentUrl || undefined,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: t(locale, 'common.home'),
                    item: currentUrl ? new URL('/', currentUrl).toString() : undefined,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: t(locale, 'activities.title'),
                    item: currentUrl ? new URL('/activities', currentUrl).toString() : undefined,
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: translation.title ?? t(locale, 'activities.title'),
                    item: currentUrl || undefined,
                },
            ],
        },
    ];

    return (
        <PublicLayout
            title={translation.title ?? t(locale, 'activities.title')}
            description={translation.description}
            imageUrl={imageUrl}
            structuredData={structuredData}
            seoType="article"
            blendHeader
        >
            <PageHero
                title={translation.title ?? t(locale, 'activities.title')}
                subtitle={t(locale, 'activities.title')}
                description={translation.description}
                compact
            >
                <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-blue-200">
                    <Link href={publicHref('/')} className="transition-colors hover:text-white">
                        {t(locale, 'common.home')}
                    </Link>
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                    <Link href={publicHref('/activities')} className="transition-colors hover:text-white">
                        {t(locale, 'activities.title')}
                    </Link>
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                    <span className="text-white" aria-current="page">
                        {translation.title}
                    </span>
                </nav>
            </PageHero>
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href={publicHref('/activities')} className="mb-6 inline-flex text-sm text-blue-700 hover:underline">{t(locale, 'activities.back')}</Link>
                <Badge variant={activity.status === 'in_progress' ? 'default' : 'secondary'} className="mb-3">
                    {getStatusLabel(activity.status, locale)}
                </Badge>
                {(activity.start_date || activity.end_date) && (
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {activity.start_date} {activity.end_date ? `- ${activity.end_date}` : ''}
                    </div>
                )}
                {activity.featured_image && (
                    <PublicImage
                        src={`/storage/${activity.featured_image}`}
                        alt={translation.title}
                        className="mb-6 max-h-80 w-full rounded-lg object-cover"
                        priority
                        sizes="(min-width: 1024px) 896px, 100vw"
                    />
                )}
                {translation.description && (
                    <div className="mb-6 prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: translation.description }} />
                )}
                {translation.objectives && (
                    <div className="mb-6 rounded-lg bg-blue-50 p-4">
                        <h2 className="mb-2 font-semibold text-blue-900">{t(locale, 'common.objectives')}</h2>
                        <div className="prose text-sm text-blue-800" dangerouslySetInnerHTML={{ __html: translation.objectives }} />
                    </div>
                )}
                <SocialShare
                    title={translation.title ?? t(locale, 'activities.title')}
                    url={currentUrl}
                    description={translation.description}
                />
            </div>
        </PublicLayout>
    );
}

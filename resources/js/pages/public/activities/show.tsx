import { Badge } from '@/components/ui/badge';
import PublicImage from '@/components/public-image';
import SocialShare from '@/components/social-share';
import PublicLayout from '@/layouts/public-layout';
import { getStatusLabel, getTranslation, t } from '@/lib/i18n';
import { Link, usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';

export default function ActivityShow({ activity }: { activity: any }) {
    const locale = (usePage().props as any).locale ?? 'en';
    const currentUrl = (usePage().props as any).ziggy?.location ?? '';
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
        >
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href="/activities" className="mb-6 inline-flex text-sm text-blue-700 hover:underline">{t(locale, 'activities.back')}</Link>
                <Badge variant={activity.status === 'in_progress' ? 'default' : 'secondary'} className="mb-3">
                    {getStatusLabel(activity.status, locale)}
                </Badge>
                <h1 className="mb-4 text-3xl font-bold text-gray-900">{translation.title}</h1>
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

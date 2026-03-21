import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicImage from '@/components/public-image';
import PublicLayout from '@/layouts/public-layout';
import { getStatusLabel, getTranslation, t } from '@/lib/i18n';
import { Link, router, usePage } from '@inertiajs/react';

const statusVariant: Record<string, any> = {
    planned: 'secondary',
    in_progress: 'default',
    completed: 'outline',
};

export default function ActivitiesIndex({ activities, filters }: { activities: any; filters: any }) {
    const locale = (usePage().props as any).locale ?? 'en';
    const currentUrl = (usePage().props as any).ziggy?.location ?? '';
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: t(locale, 'activities.title'),
            description: t(locale, 'activities.description'),
            inLanguage: locale,
            url: currentUrl || undefined,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: t(locale, 'activities.title'),
            itemListElement: activities.data.map((activity: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: getTranslation(activity, locale).title ?? t(locale, 'activities.title'),
                url: currentUrl ? new URL(`/activities/${activity.slug}`, currentUrl).toString() : undefined,
            })),
        },
    ];

    return (
        <PublicLayout title={t(locale, 'nav.activities')} description={t(locale, 'activities.description')} structuredData={structuredData}>
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{t(locale, 'activities.title')}</h1>
                <p className="mb-8 text-gray-500">{t(locale, 'activities.description')}</p>

                <div className="mb-6 flex flex-wrap gap-2">
                    {['', 'planned', 'in_progress', 'completed'].map((status) => (
                        <Button key={status} variant={filters.status === status || (! status && ! filters.status) ? 'default' : 'outline'} size="sm" onClick={() => router.get('/activities', status ? { status } : {})}>
                            {status ? getStatusLabel(status, locale) : t(locale, 'common.all')}
                        </Button>
                    ))}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {activities.data.map((activity: any) => {
                        const translation = getTranslation(activity, locale);

                        return (
                            <Card key={activity.id} className="hover:shadow-md transition-shadow">
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
                                <CardHeader className="pb-2">
                                    <Badge variant={statusVariant[activity.status] ?? 'secondary'} className="w-fit">
                                        {getStatusLabel(activity.status, locale)}
                                    </Badge>
                                    <CardTitle className="text-base mt-2">{translation.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 line-clamp-3">{translation.description}</p>
                                    <Link href={`/activities/${activity.slug}`} className="mt-3 flex items-center text-sm text-blue-700 hover:underline">
                                        {t(locale, 'common.learnMore')}
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {activities.data.length === 0 && (
                    <p className="py-12 text-center text-gray-500">{t(locale, 'activities.empty')}</p>
                )}
            </div>
        </PublicLayout>
    );
}

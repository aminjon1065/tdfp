import { router, usePage } from '@inertiajs/react';
import { Play } from 'lucide-react';

import PageHero from '@/components/page-hero';
import PublicImage from '@/components/public-image';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { getTranslation, t } from '@/lib/i18n';
import { publicLocaleQuery } from '@/lib/public-locale';

export default function MediaIndex({
    items,
    filters,
}: {
    items: any;
    filters: any;
}) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const localeQuery = publicLocaleQuery(locale, defaultLocale);
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: t(locale, 'media.title'),
            description: t(locale, 'media.description'),
            inLanguage: locale,
            url: currentUrl || undefined,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: t(locale, 'media.title'),
            itemListElement: items.data.map((item: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: getTranslation(item, locale).title ?? `Media ${item.id}`,
                url: currentUrl
                    ? `${new URL('/media', currentUrl).toString()}#media-item-${item.id}`
                    : undefined,
            })),
        },
    ];

    return (
        <PublicLayout
            title={t(locale, 'media.title')}
            description={t(locale, 'media.description')}
            structuredData={structuredData}
            seoType="website"
            blendHeader
        >
            <PageHero
                title={t(locale, 'media.title')}
                subtitle={t(locale, 'media.title')}
                description={t(locale, 'media.description')}
                compact
            />
            <div className="container mx-auto px-4 py-12">
                <div className="mb-6 flex gap-2">
                    {['', 'image', 'video'].map((type) => (
                        <Button
                            key={type}
                            variant={
                                filters.type === type ||
                                (!type && !filters.type)
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            onClick={() =>
                                router.get(
                                    '/media',
                                    type
                                        ? { ...localeQuery, type }
                                        : localeQuery,
                                )
                            }
                        >
                            {type
                                ? type.charAt(0).toUpperCase() + type.slice(1)
                                : t(locale, 'common.all')}
                        </Button>
                    ))}
                </div>

                <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {items.data.map((item: any) => {
                        const t = getTranslation(item, locale);
                        return (
                            <li
                                id={`media-item-${item.id}`}
                                key={item.id}
                                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                            >
                                <figure className="h-full w-full">
                                    {item.type === 'image' && item.file_path ? (
                                        <PublicImage
                                            src={`/storage/${item.file_path}`}
                                            alt={t.title ?? 'Media item'}
                                            className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-105"
                                            sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 100vw"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-gray-200">
                                            <Play
                                                className="h-10 w-10 text-gray-500"
                                                aria-hidden="true"
                                            />
                                            <span className="sr-only">
                                                {t.title ?? 'Video media item'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
                                    {t.title && (
                                        <figcaption className="absolute right-0 bottom-0 left-0 translate-y-full bg-gradient-to-t from-black/60 p-3 transition-transform group-hover:translate-y-0">
                                            <p className="text-sm font-medium text-white">
                                                {t.title}
                                            </p>
                                        </figcaption>
                                    )}
                                </figure>
                            </li>
                        );
                    })}
                </ul>

                {items.data.length === 0 && (
                    <p className="py-12 text-center text-gray-500">
                        {t(locale, 'media.empty')}
                    </p>
                )}
            </div>
        </PublicLayout>
    );
}

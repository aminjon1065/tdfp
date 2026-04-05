import { Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

import PageHero from '@/components/page-hero';
import PublicImage from '@/components/public-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { localizedPublicHref, publicLocaleQuery } from '@/lib/public-locale';

export default function NewsIndex({
    news,
    categories,
    filters,
}: {
    news: any;
    categories: any[];
    filters: any;
}) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const localeQuery = publicLocaleQuery(locale, defaultLocale);
    const [search, setSearch] = useState(filters.search ?? '');
    const [currentTimestamp] = useState(() => Date.now());
    const recentWindowDays = page.recentWindowDays ?? 14;

    const isRecent = (publishedAt?: string | null) =>
        publishedAt &&
        (currentTimestamp - new Date(publishedAt).getTime()) /
            (1000 * 60 * 60 * 24) <=
            recentWindowDays;

    return (
        <PublicLayout
            title={t(locale, 'news.title')}
            description={t(locale, 'news.indexDescription')}
            seoType="website"
            blendHeader
        >
            <PageHero
                title={t(locale, 'news.indexTitle')}
                subtitle={t(locale, 'news.title')}
                description={t(locale, 'news.indexDescription')}
                compact
                breadcrumbs={[
                    {
                        label: t(locale, 'nav.home'),
                        href: localizedPublicHref('/', locale, defaultLocale),
                    },
                    { label: t(locale, 'news.indexTitle') },
                ]}
            />
            <div className="container mx-auto space-y-8 px-4 py-12">
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get('/news', {
                                ...localeQuery,
                                search,
                                category_id: filters.category_id,
                            });
                        }}
                        className="flex flex-col gap-3 sm:flex-row"
                        role="search"
                    >
                        <label htmlFor="news-search-query" className="sr-only">
                            {t(locale, 'news.searchPlaceholder')}
                        </label>
                        <Input
                            id="news-search-query"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t(locale, 'news.searchPlaceholder')}
                            className="w-full sm:w-64"
                        />
                        <Button type="submit" variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                            variant={
                                !filters.category_id ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() =>
                                router.get('/news', {
                                    ...localeQuery,
                                    search: filters.search,
                                })
                            }
                        >
                            {t(locale, 'common.all')}
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={
                                    filters.category_id == category.id
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                    router.get('/news', {
                                        ...localeQuery,
                                        category_id: category.id,
                                        search: filters.search,
                                    })
                                }
                            >
                                {t(
                                    locale,
                                    `news.category.${category.slug}` as any,
                                ) || category.name}
                            </Button>
                        ))}
                    </div>
                </section>

                {news && news.data.length > 0 ? (
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {news.data.map((item: any) => {
                            const translation = getTranslation(item, locale);

                            return (
                                <li key={item.id} className="relative">
                                    <Card className="flex h-full flex-col overflow-hidden rounded-3xl border-slate-200 bg-white transition-shadow hover:shadow-md">
                                        {item.featured_image && (
                                            <div className="aspect-video overflow-hidden bg-slate-100">
                                                <PublicImage
                                                    src={`/storage/${item.featured_image}`}
                                                    alt={translation.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <CardHeader className="pb-2">
                                            <div className="flex flex-wrap gap-2">
                                                {item.category && (
                                                    <Badge
                                                        variant="outline"
                                                        className="w-fit text-xs"
                                                    >
                                                        {t(
                                                            locale,
                                                            `news.category.${item.category.slug}` as any,
                                                        ) ||
                                                            item.category.name}
                                                    </Badge>
                                                )}
                                                {isRecent(item.published_at) && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    >
                                                        {t(
                                                            locale,
                                                            'news.new',
                                                        )}
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardTitle className="line-clamp-2 text-base">
                                                {translation.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-1 flex-col justify-between">
                                            <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                                                {translation.summary}
                                            </p>
                                            <time className="text-xs text-gray-400">
                                                {formatLocalizedDate(
                                                    item.published_at,
                                                    locale,
                                                )}
                                            </time>
                                        </CardContent>
                                    </Card>
                                    <Link
                                        href={`/news/${item.slug}`}
                                        className="absolute inset-0"
                                        aria-label={translation.title}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-gray-500">
                        {t(locale, 'news.empty')}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

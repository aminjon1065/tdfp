import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PageHero from '@/components/page-hero';
import PublicImage from '@/components/public-image';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { publicLocaleQuery } from '@/lib/public-locale';
import { Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function NewsIndex({ news, categories, filters }: { news: any; categories: any[]; filters: any }) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const localeQuery = publicLocaleQuery(locale, defaultLocale);
    const [search, setSearch] = useState(filters.search ?? '');
    const featuredAnnouncements = page.featuredAnnouncements ?? [];
    const recentWindowDays = page.recentWindowDays ?? 14;
    const isRecent = (publishedAt?: string | null) =>
        publishedAt
        && ((Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24)) <= recentWindowDays;
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: t(locale, 'news.title'),
            description: t(locale, 'news.indexDescription'),
            inLanguage: locale,
            url: currentUrl || undefined,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: t(locale, 'news.title'),
            itemListElement: news.data.map((item: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: getTranslation(item, locale).title ?? `News ${item.id}`,
                url: currentUrl ? new URL(`/news/${item.slug}`, currentUrl).toString() : undefined,
            })),
        },
    ];

    return (
        <PublicLayout
            title={t(locale, 'news.title')}
            description={t(locale, 'news.indexDescription')}
            structuredData={structuredData}
            seoType="website"
            blendHeader
        >
            <PageHero
                title={t(locale, 'news.indexTitle')}
                subtitle={t(locale, 'news.title')}
                description={t(locale, 'news.indexDescription')}
                compact
            />
            <div className="container mx-auto space-y-8 px-4 py-12">
                {featuredAnnouncements.length > 0 && (
                    <section aria-labelledby="featured-announcements-heading" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4">
                            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--public-accent)]">{t(locale, 'news.whatsNew')}</p>
                            <h2 id="featured-announcements-heading" className="text-sm text-slate-600">{t(locale, 'news.whatsNewDescription')}</h2>
                        </div>
                        <ul className="grid gap-4 lg:grid-cols-3">
                            {featuredAnnouncements.map((item: any) => {
                                const translation = getTranslation(item, locale);

                                return (
                                    <li key={item.id}>
                                    <Link href={`/news/${item.slug}`} className="block rounded-2xl border border-slate-200 bg-[var(--public-surface)] p-4 transition hover:border-[var(--public-accent)]/30 hover:shadow-sm">
                                        <div className="mb-2 flex items-center gap-2">
                                            {item.is_featured && <Badge>{t(locale, 'news.featured')}</Badge>}
                                            {isRecent(item.published_at) && <Badge variant="outline">{t(locale, 'news.new')}</Badge>}
                                        </div>
                                        <p className="font-medium text-gray-900">{translation.title}</p>
                                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">{translation.summary}</p>
                                    </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                )}

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <form onSubmit={(event) => { event.preventDefault(); router.get('/news', { ...localeQuery, search, category_id: filters.category_id }); }} className="flex flex-col gap-3 sm:flex-row" role="search" aria-label={t(locale, 'news.indexTitle')}>
                        <label htmlFor="news-search-query" className="sr-only">
                            {t(locale, 'news.searchPlaceholder')}
                        </label>
                        <Input id="news-search-query" name="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t(locale, 'news.searchPlaceholder')} className="w-full sm:w-64" />
                        <Button type="submit" variant="outline" size="icon" aria-label={t(locale, 'news.indexTitle')} className="w-full sm:w-10">
                            <Search className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </form>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant={! filters.category_id ? 'default' : 'outline'} size="sm" onClick={() => router.get('/news', { ...localeQuery, search: filters.search })}>{t(locale, 'common.all')}</Button>
                        {categories.map((category) => (
                            <Button key={category.id} variant={filters.category_id == category.id ? 'default' : 'outline'} size="sm" onClick={() => router.get('/news', { ...localeQuery, category_id: category.id, search: filters.search })}>
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </section>

                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {news.data.map((item: any) => {
                        const translation = getTranslation(item, locale);

                        return (
                            <li key={item.id}>
                            <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white transition-shadow hover:shadow-md">
                                {item.featured_image && (
                                    <div className="aspect-video overflow-hidden bg-slate-100">
                                        <PublicImage
                                            src={`/storage/${item.featured_image}`}
                                            alt={translation.title}
                                            className="h-full w-full object-cover"
                                            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw"
                                        />
                                    </div>
                                )}
                                <CardHeader className="pb-2">
                                    <div className="flex flex-wrap gap-2">
                                        {item.category && <Badge variant="outline" className="w-fit text-xs">{item.category.name}</Badge>}
                                        {item.is_featured && <Badge className="w-fit text-xs">{t(locale, 'news.featured')}</Badge>}
                                        {isRecent(item.published_at) && <Badge variant="outline" className="w-fit text-xs border-emerald-200 bg-emerald-50 text-emerald-700">{t(locale, 'news.new')}</Badge>}
                                    </div>
                                    <CardTitle className="text-base">{translation.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 line-clamp-2">{translation.summary}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <time dateTime={item.published_at ?? undefined} className="text-xs text-gray-400">
                                            {formatLocalizedDate(item.published_at, locale)}
                                        </time>
                                        <Link href={`/news/${item.slug}`} className="text-sm font-medium text-[var(--public-accent)] hover:underline">{t(locale, 'common.readMore')}</Link>
                                    </div>
                                </CardContent>
                            </Card>
                            </li>
                        );
                    })}
                </ul>

                {news.data.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-gray-500">{t(locale, 'news.empty')}</div>
                )}
            </div>
        </PublicLayout>
    );
}

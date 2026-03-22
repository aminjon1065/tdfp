import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PublicImage from '@/components/public-image';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function NewsIndex({ news, categories, filters }: { news: any; categories: any[]; filters: any }) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
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
        >
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{t(locale, 'news.indexTitle')}</h1>
                <p className="mb-8 text-gray-500">{t(locale, 'news.indexDescription')}</p>

                {featuredAnnouncements.length > 0 && (
                    <section aria-labelledby="featured-announcements-heading" className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                        <div className="mb-4">
                            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{t(locale, 'news.whatsNew')}</p>
                            <h2 id="featured-announcements-heading" className="text-sm text-slate-600">{t(locale, 'news.whatsNewDescription')}</h2>
                        </div>
                        <ul className="grid gap-4 lg:grid-cols-3">
                            {featuredAnnouncements.map((item: any) => {
                                const translation = getTranslation(item, locale);

                                return (
                                    <li key={item.id}>
                                    <Link href={`/news/${item.slug}`} className="block rounded-xl border bg-white p-4 transition hover:border-blue-300 hover:shadow-sm">
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

                <div className="mb-8 space-y-3">
                    <form onSubmit={(event) => { event.preventDefault(); router.get('/news', { search, category_id: filters.category_id }); }} className="flex flex-col gap-3 sm:flex-row" role="search" aria-label={t(locale, 'news.indexTitle')}>
                        <label htmlFor="news-search-query" className="sr-only">
                            {t(locale, 'news.searchPlaceholder')}
                        </label>
                        <Input id="news-search-query" name="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t(locale, 'news.searchPlaceholder')} className="w-full sm:w-64" />
                        <Button type="submit" variant="outline" size="icon" aria-label={t(locale, 'news.indexTitle')} className="w-full sm:w-10">
                            <Search className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </form>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant={! filters.category_id ? 'default' : 'outline'} size="sm" onClick={() => router.get('/news', { search: filters.search })}>{t(locale, 'common.all')}</Button>
                        {categories.map((category) => (
                            <Button key={category.id} variant={filters.category_id == category.id ? 'default' : 'outline'} size="sm" onClick={() => router.get('/news', { category_id: category.id, search: filters.search })}>
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </div>

                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {news.data.map((item: any) => {
                        const translation = getTranslation(item, locale);

                        return (
                            <li key={item.id}>
                            <Card className="overflow-hidden transition-shadow hover:shadow-md">
                                {item.featured_image && (
                                    <div className="aspect-video bg-gray-100 overflow-hidden">
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
                                        <Link href={`/news/${item.slug}`} className="text-sm text-blue-700 hover:underline">{t(locale, 'common.readMore')}</Link>
                                    </div>
                                </CardContent>
                            </Card>
                            </li>
                        );
                    })}
                </ul>

                {news.data.length === 0 && (
                    <p className="py-12 text-center text-gray-500">{t(locale, 'news.empty')}</p>
                )}
            </div>
        </PublicLayout>
    );
}

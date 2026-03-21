import { Badge } from '@/components/ui/badge';
import SocialShare from '@/components/social-share';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, User } from 'lucide-react';

export default function NewsShow({
    news,
    latest,
    previewMeta,
}: {
    news: any;
    latest: any[];
    previewMeta?: { label: string; description: string };
}) {
    const locale = (usePage().props as any).locale ?? 'en';
    const currentUrl = (usePage().props as any).ziggy?.location ?? '';
    const translation = getTranslation(news, locale);
    const imageUrl = news.featured_image && currentUrl
        ? new URL(`/storage/${news.featured_image}`, currentUrl).toString()
        : undefined;
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: translation.title ?? t(locale, 'news.title'),
            description: translation.summary ?? undefined,
            datePublished: news.published_at ?? undefined,
            dateModified: news.updated_at ?? news.published_at ?? undefined,
            author: news.author ? {
                '@type': 'Person',
                name: news.author.name,
            } : undefined,
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
                    name: t(locale, 'news.title'),
                    item: currentUrl ? new URL('/news', currentUrl).toString() : undefined,
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: translation.title ?? t(locale, 'news.title'),
                    item: currentUrl || undefined,
                },
            ],
        },
    ];

    return (
        <PublicLayout
            title={translation.title ?? t(locale, 'news.title')}
            description={translation.summary}
            imageUrl={imageUrl}
            structuredData={structuredData}
            seoType="article"
        >
            {previewMeta && (
                <div className="border-b border-amber-200 bg-amber-50">
                    <div className="container mx-auto px-4 py-3 text-sm text-amber-950">
                        <p className="font-semibold">{previewMeta.label}</p>
                        <p className="mt-1 text-amber-800">{previewMeta.description}</p>
                    </div>
                </div>
            )}
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 lg:grid-cols-3">
                    <article className="lg:col-span-2">
                        {news.category && <Badge variant="outline" className="mb-3">{news.category.name}</Badge>}
                        <h1 className="mb-4 text-3xl font-bold text-gray-900">{translation.title}</h1>
                        <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
                            {news.published_at && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" aria-hidden="true" /><time dateTime={news.published_at}>{formatLocalizedDate(news.published_at, locale)}</time></span>}
                            {news.author && <span className="flex items-center gap-1"><User className="h-4 w-4" aria-hidden="true" />{news.author.name}</span>}
                        </div>
                        {translation.summary && <p className="mb-6 text-lg text-gray-600 font-medium border-l-4 border-blue-700 pl-4">{translation.summary}</p>}
                        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: translation.content ?? '' }} />
                        <SocialShare
                            className="mt-8"
                            title={translation.title ?? t(locale, 'news.title')}
                            url={currentUrl}
                            description={translation.summary}
                        />
                    </article>

                    <aside aria-labelledby="latest-news-heading" className="space-y-6">
                        <div>
                            <h2 id="latest-news-heading" className="mb-4 text-lg font-semibold">{t(locale, 'common.latestNews')}</h2>
                            <ul className="space-y-4">
                                {latest.filter((item) => item.id !== news.id).slice(0, 4).map((item: any) => {
                                    const latestTranslation = getTranslation(item, locale);

                                    return (
                                        <li key={item.id}>
                                        <Link href={`/news/${item.slug}`} className="block group">
                                            <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{latestTranslation.title}</p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                <time dateTime={item.published_at ?? undefined}>{formatLocalizedDate(item.published_at, locale)}</time>
                                            </p>
                                        </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    );
}

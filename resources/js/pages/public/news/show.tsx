import { Badge } from '@/components/ui/badge';
import PageHero from '@/components/page-hero';
import SocialShare from '@/components/social-share';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, ChevronRight, User } from 'lucide-react';

export default function NewsShow({
    news,
    latest,
    previewMeta,
}: {
    news: any;
    latest: any[];
    previewMeta?: { label: string; description: string };
}) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const publicHref = (path: string) => localizedPublicHref(path, locale, defaultLocale);
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
            blendHeader
        >
            {previewMeta && (
                <div className="border-b border-amber-200 bg-amber-50">
                    <div className="container mx-auto px-4 py-3 text-sm text-amber-950">
                        <p className="font-semibold">{previewMeta.label}</p>
                        <p className="mt-1 text-amber-800">{previewMeta.description}</p>
                    </div>
                </div>
            )}
            <PageHero
                title={translation.title ?? t(locale, 'news.title')}
                subtitle={t(locale, 'news.title')}
                description={translation.summary}
                compact
            >
                <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-blue-200">
                    <Link href={publicHref('/')} className="transition-colors hover:text-white">
                        {t(locale, 'common.home')}
                    </Link>
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                    <Link href={publicHref('/news')} className="transition-colors hover:text-white">
                        {t(locale, 'news.title')}
                    </Link>
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                    <span className="text-white" aria-current="page">
                        {translation.title}
                    </span>
                </nav>
            </PageHero>
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 lg:grid-cols-3">
                    <article className="lg:col-span-2">
                        {news.category && <Badge variant="outline" className="mb-3">{news.category.name}</Badge>}
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
                                        <Link href={publicHref(`/news/${item.slug}`)} className="block group">
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

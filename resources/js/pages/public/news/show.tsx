import { Badge } from '@/components/ui/badge';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, User } from 'lucide-react';

export default function NewsShow({ news, latest }: { news: any; latest: any[] }) {
    const locale = (usePage().props as any).locale ?? 'en';
    const translation = getTranslation(news, locale);

    return (
        <PublicLayout title={translation.title ?? t(locale, 'news.title')}>
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 lg:grid-cols-3">
                    <article className="lg:col-span-2">
                        {news.category && <Badge variant="outline" className="mb-3">{news.category.name}</Badge>}
                        <h1 className="mb-4 text-3xl font-bold text-gray-900">{translation.title}</h1>
                        <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
                            {news.published_at && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatLocalizedDate(news.published_at, locale)}</span>}
                            {news.author && <span className="flex items-center gap-1"><User className="h-4 w-4" />{news.author.name}</span>}
                        </div>
                        {translation.summary && <p className="mb-6 text-lg text-gray-600 font-medium border-l-4 border-blue-700 pl-4">{translation.summary}</p>}
                        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: translation.content ?? '' }} />
                    </article>

                    <aside className="space-y-6">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">{t(locale, 'common.latestNews')}</h3>
                            <div className="space-y-4">
                                {latest.filter((item) => item.id !== news.id).slice(0, 4).map((item: any) => {
                                    const latestTranslation = getTranslation(item, locale);

                                    return (
                                        <Link key={item.id} href={`/news/${item.slug}`} className="block group">
                                            <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{latestTranslation.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{formatLocalizedDate(item.published_at, locale)}</p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    );
}

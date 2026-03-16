import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, User } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';

interface Props {
    news: any;
    latest: any[];
}

export default function NewsShow({ news, latest }: Props) {
    const locale = (usePage().props as any).locale ?? 'en';
    const t = getTranslation(news, locale);

    return (
        <PublicLayout title={t.title ?? 'News'}>
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 lg:grid-cols-3">
                    <article className="lg:col-span-2">
                        {news.category && (
                            <Badge variant="outline" className="mb-3">{news.category.name}</Badge>
                        )}
                        <h1 className="mb-4 text-3xl font-bold text-gray-900">{t.title}</h1>
                        <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
                            {news.published_at && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(news.published_at).toLocaleDateString()}
                                </span>
                            )}
                            {news.author && (
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {news.author.name}
                                </span>
                            )}
                        </div>
                        {news.featured_image && (
                            <img
                                src={`/storage/${news.featured_image}`}
                                alt={t.title}
                                className="mb-6 w-full rounded-lg object-cover max-h-80"
                            />
                        )}
                        {t.summary && (
                            <p className="mb-6 text-lg text-gray-600 font-medium border-l-4 border-blue-700 pl-4">{t.summary}</p>
                        )}
                        <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: t.content ?? '' }}
                        />
                    </article>

                    <aside className="space-y-6">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Latest News</h3>
                            <div className="space-y-4">
                                {latest.filter((item) => item.id !== news.id).slice(0, 4).map((item: any) => {
                                    const lt = getTranslation(item, locale);
                                    return (
                                        <Link key={item.id} href={`/news/${item.slug}`} className="block group">
                                            <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{lt.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.published_at ? new Date(item.published_at).toLocaleDateString() : ''}</p>
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

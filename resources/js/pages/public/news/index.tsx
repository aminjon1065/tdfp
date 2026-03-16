import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function NewsIndex({ news, categories, filters }: { news: any; categories: any[]; filters: any }) {
    const locale = (usePage().props as any).locale ?? 'en';
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <PublicLayout title={t(locale, 'news.title')}>
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{t(locale, 'news.indexTitle')}</h1>
                <p className="mb-8 text-gray-500">{t(locale, 'news.indexDescription')}</p>

                <div className="mb-8 flex flex-wrap gap-3">
                    <form onSubmit={(event) => { event.preventDefault(); router.get('/news', { search, category_id: filters.category_id }); }} className="flex gap-2">
                        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t(locale, 'news.searchPlaceholder')} className="w-64" />
                        <Button type="submit" variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
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

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {news.data.map((item: any) => {
                        const translation = getTranslation(item, locale);

                        return (
                            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                {item.featured_image && (
                                    <div className="aspect-video bg-gray-100 overflow-hidden">
                                        <img src={`/storage/${item.featured_image}`} alt={translation.title} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <CardHeader className="pb-2">
                                    {item.category && <Badge variant="outline" className="w-fit text-xs">{item.category.name}</Badge>}
                                    <CardTitle className="text-base">{translation.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 line-clamp-2">{translation.summary}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">{formatLocalizedDate(item.published_at, locale)}</span>
                                        <Link href={`/news/${item.slug}`} className="text-sm text-blue-700 hover:underline">{t(locale, 'common.readMore')}</Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {news.data.length === 0 && (
                    <p className="py-12 text-center text-gray-500">{t(locale, 'news.empty')}</p>
                )}
            </div>
        </PublicLayout>
    );
}

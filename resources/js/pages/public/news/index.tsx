import PublicLayout from '@/layouts/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { getTranslation } from '@/lib/i18n';

interface Props {
    news: any;
    categories: any[];
    filters: any;
}

export default function NewsIndex({ news, categories, filters }: Props) {
    const locale = (usePage().props as any).locale ?? 'en';
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <PublicLayout title="News">
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">News & Events</h1>
                <p className="mb-8 text-gray-500">Latest updates from the Tajikistan Digital Foundations Project</p>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-3">
                    <form onSubmit={(e) => { e.preventDefault(); router.get('/news', { search, category_id: filters.category_id }); }} className="flex gap-2">
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search news..." className="w-64" />
                        <Button type="submit" variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
                    </form>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant={!filters.category_id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => router.get('/news', { search: filters.search })}
                        >All</Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={filters.category_id == cat.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => router.get('/news', { category_id: cat.id, search: filters.search })}
                            >{cat.name}</Button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {news.data.map((item: any) => {
                        const t = getTranslation(item, locale);
                        return (
                            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                {item.featured_image && (
                                    <div className="aspect-video bg-gray-100 overflow-hidden">
                                        <img src={`/storage/${item.featured_image}`} alt={t.title} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <CardHeader className="pb-2">
                                    {item.category && <Badge variant="outline" className="w-fit text-xs">{item.category.name}</Badge>}
                                    <CardTitle className="text-base">{t.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 line-clamp-2">{t.summary}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">{item.published_at ? new Date(item.published_at).toLocaleDateString() : ''}</span>
                                        <Link href={`/news/${item.slug}`} className="text-sm text-blue-700 hover:underline">Read more</Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {news.data.length === 0 && (
                    <p className="py-12 text-center text-gray-500">No news articles found.</p>
                )}

                {/* Pagination */}
                {news.last_page > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {news.links.map((link: any, i: number) => (
                            <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

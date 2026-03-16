import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';

interface Props {
    results: any;
    query: string;
    filters: any;
}

export default function SearchPage({ results, query, filters }: Props) {
    const locale = (usePage().props as any).locale ?? 'en';
    const { data, setData, get, processing } = useForm({ q: query ?? '', entity_type: filters.entity_type ?? '' });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/search', { q: data.q, entity_type: data.entity_type });
    };

    return (
        <PublicLayout title="Search">
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">Search</h1>

                <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                    <Input value={data.q} onChange={(e) => setData('q', e.target.value)} placeholder="Search..." className="flex-1" autoFocus />
                    <Button type="submit" disabled={processing}><Search className="h-4 w-4" /></Button>
                </form>

                {query && results && (
                    <p className="mb-4 text-sm text-gray-500">{results.total} results for <strong>"{query}"</strong></p>
                )}

                {results?.data?.length > 0 ? (
                    <div className="space-y-4">
                        {results.data.map((item: any) => (
                            <div key={item.id} className="rounded-lg border p-4 hover:border-blue-300 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-xs">{item.entity_type?.split('\\').pop()}</Badge>
                                </div>
                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                                {item.content && <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.content}</p>}
                                {item.url && (
                                    <Link href={item.url} className="mt-2 flex items-center text-sm text-blue-700 hover:underline">
                                        View →
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                ) : query ? (
                    <p className="text-center py-12 text-gray-500">No results found for "{query}".</p>
                ) : null}
            </div>
        </PublicLayout>
    );
}

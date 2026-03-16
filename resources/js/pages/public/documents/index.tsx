import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { getTranslation, t } from '@/lib/i18n';
import { Link, router, usePage } from '@inertiajs/react';
import { Download, FileText, Search } from 'lucide-react';
import { useState } from 'react';

function formatSize(bytes: number): string {
    if (! bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsIndex({ documents, categories, filters }: { documents: any; categories: any[]; filters: any }) {
    const locale = (usePage().props as any).locale ?? 'en';
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <PublicLayout title={t(locale, 'documents.title')}>
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{t(locale, 'documents.indexTitle')}</h1>
                <p className="mb-8 text-gray-500">{t(locale, 'documents.indexDescription')}</p>
                <div className="mb-6 flex flex-wrap gap-3">
                    <form onSubmit={(event) => { event.preventDefault(); router.get('/documents', { search, category_id: filters.category_id }); }} className="flex gap-2">
                        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t(locale, 'documents.searchPlaceholder')} className="w-64" />
                        <Button type="submit" variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
                    </form>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant={! filters.category_id ? 'default' : 'outline'} size="sm" onClick={() => router.get('/documents', { search: filters.search })}>{t(locale, 'common.all')}</Button>
                        {categories.map((category) => <Button key={category.id} variant={filters.category_id == category.id ? 'default' : 'outline'} size="sm" onClick={() => router.get('/documents', { category_id: category.id, search: filters.search })}>{category.name}</Button>)}
                    </div>
                </div>
                <div className="space-y-3">
                    {documents.data.map((document: any) => {
                        const translation = getTranslation(document, locale);

                        return (
                            <div key={document.id} className="flex items-start justify-between gap-4 rounded-lg border p-4 hover:border-blue-300 transition-colors">
                                <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">{translation.title ?? t(locale, 'common.document')}</p>
                                        {translation.description && <p className="text-sm text-gray-500 mt-0.5">{translation.description}</p>}
                                        <div className="mt-1 flex items-center gap-2">
                                            {document.category && <Badge variant="outline" className="text-xs">{document.category.name}</Badge>}
                                            {document.file_type && <span className="text-xs text-gray-400 uppercase">{document.file_type}</span>}
                                            {document.file_size && <span className="text-xs text-gray-400">{formatSize(document.file_size)}</span>}
                                        </div>
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm" className="shrink-0">
                                    <Link href={`/documents/${document.id}/download`}>
                                        <Download className="mr-1.5 h-4 w-4" /> {t(locale, 'common.download')}
                                    </Link>
                                </Button>
                            </div>
                        );
                    })}
                </div>
                {documents.data.length === 0 && <p className="py-12 text-center text-gray-500">{t(locale, 'documents.empty')}</p>}
            </div>
        </PublicLayout>
    );
}

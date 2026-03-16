import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Download, FileText, Search } from 'lucide-react';
import { useState } from 'react';
import { getTranslation } from '@/lib/i18n';

function formatSize(bytes: number): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsIndex({ documents, categories, filters }: { documents: any; categories: any[]; filters: any }) {
    const locale = (usePage().props as any).locale ?? 'en';
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <PublicLayout title="Documents">
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Document Repository</h1>
                <p className="mb-8 text-gray-500">Project documentation, reports, technical studies and policies</p>

                <div className="mb-6 flex flex-wrap gap-3">
                    <form onSubmit={(e) => { e.preventDefault(); router.get('/documents', { search, category_id: filters.category_id }); }} className="flex gap-2">
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents..." className="w-64" />
                        <Button type="submit" variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
                    </form>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant={!filters.category_id ? 'default' : 'outline'} size="sm" onClick={() => router.get('/documents', { search: filters.search })}>All</Button>
                        {categories.map((cat) => (
                            <Button key={cat.id} variant={filters.category_id == cat.id ? 'default' : 'outline'} size="sm" onClick={() => router.get('/documents', { category_id: cat.id, search: filters.search })}>{cat.name}</Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {documents.data.map((doc: any) => {
                        const t = getTranslation(doc, locale);
                        return (
                            <div key={doc.id} className="flex items-start justify-between gap-4 rounded-lg border p-4 hover:border-blue-300 transition-colors">
                                <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">{t.title ?? 'Document'}</p>
                                        {t.description && <p className="text-sm text-gray-500 mt-0.5">{t.description}</p>}
                                        <div className="mt-1 flex items-center gap-2">
                                            {doc.category && <Badge variant="outline" className="text-xs">{doc.category.name}</Badge>}
                                            {doc.file_type && <span className="text-xs text-gray-400 uppercase">{doc.file_type}</span>}
                                            {doc.file_size && <span className="text-xs text-gray-400">{formatSize(doc.file_size)}</span>}
                                        </div>
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm" className="shrink-0">
                                    <Link href={`/documents/${doc.id}/download`}>
                                        <Download className="mr-1.5 h-4 w-4" /> Download
                                    </Link>
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {documents.data.length === 0 && (
                    <p className="py-12 text-center text-gray-500">No documents found.</p>
                )}

                {documents.last_page > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {documents.links.map((link: any, i: number) => (
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

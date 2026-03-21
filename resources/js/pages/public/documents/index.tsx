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

export default function DocumentsIndex({
    documents,
    categories,
    filters,
    years,
    fileTypes,
    tags,
}: {
    documents: any;
    categories: any[];
    filters: any;
    years: number[];
    fileTypes: string[];
    tags: { id: number; name: string; slug: string }[];
}) {
    const locale = (usePage().props as any).locale ?? 'en';
    const currentUrl = (usePage().props as any).ziggy?.location ?? '';
    const [search, setSearch] = useState(filters.search ?? '');
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: t(locale, 'documents.indexTitle'),
            description: t(locale, 'documents.indexDescription'),
            inLanguage: locale,
            url: currentUrl || undefined,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: t(locale, 'documents.indexTitle'),
            itemListElement: documents.data.map((document: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: getTranslation(document, locale).title ?? t(locale, 'common.document'),
                url: currentUrl ? new URL(`/documents/${document.id}/download`, currentUrl).toString() : undefined,
            })),
        },
    ];

    return (
        <PublicLayout
            title={t(locale, 'documents.title')}
            description={t(locale, 'documents.indexDescription')}
            structuredData={structuredData}
            seoType="website"
        >
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{t(locale, 'documents.indexTitle')}</h1>
                <p className="mb-8 text-gray-500">{t(locale, 'documents.indexDescription')}</p>
                <div className="mb-6 space-y-3">
                    <form onSubmit={(event) => { event.preventDefault(); router.get('/documents', { search, category_id: filters.category_id, year: filters.year, file_type: filters.file_type, tag: filters.tag }); }} className="flex flex-col gap-3 sm:flex-row" role="search" aria-label={t(locale, 'documents.indexTitle')}>
                        <label htmlFor="document-search-query" className="sr-only">
                            {t(locale, 'documents.searchPlaceholder')}
                        </label>
                        <Input id="document-search-query" name="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t(locale, 'documents.searchPlaceholder')} className="w-full sm:w-64" />
                        <Button type="submit" variant="outline" size="icon" aria-label={t(locale, 'documents.indexTitle')} className="w-full sm:w-10">
                            <Search className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </form>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label htmlFor="document-year-filter" className="sr-only">Filter by year</label>
                            <select
                                id="document-year-filter"
                                value={filters.year ?? ''}
                                onChange={(event) => router.get('/documents', { search: filters.search, category_id: filters.category_id, year: event.target.value || undefined, file_type: filters.file_type, tag: filters.tag })}
                                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="">{t(locale, 'common.all')}</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="document-file-type-filter" className="sr-only">Filter by file type</label>
                            <select
                                id="document-file-type-filter"
                                value={filters.file_type ?? ''}
                                onChange={(event) => router.get('/documents', { search: filters.search, category_id: filters.category_id, year: filters.year, file_type: event.target.value || undefined, tag: filters.tag })}
                                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm uppercase"
                            >
                                <option value="">{t(locale, 'common.all')}</option>
                                {fileTypes.map((fileType) => (
                                    <option key={fileType} value={fileType}>
                                        {fileType}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant={! filters.category_id ? 'default' : 'outline'} size="sm" onClick={() => router.get('/documents', { search: filters.search, year: filters.year, file_type: filters.file_type, tag: filters.tag })}>{t(locale, 'common.all')}</Button>
                        {categories.map((category) => <Button key={category.id} variant={filters.category_id == category.id ? 'default' : 'outline'} size="sm" onClick={() => router.get('/documents', { category_id: category.id, search: filters.search, year: filters.year, file_type: filters.file_type, tag: filters.tag })}>{category.name}</Button>)}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant={! filters.tag ? 'default' : 'outline'} size="sm" onClick={() => router.get('/documents', { search: filters.search, category_id: filters.category_id, year: filters.year, file_type: filters.file_type })}>{t(locale, 'common.all')}</Button>
                        {tags.map((tag) => <Button key={tag.id} variant={filters.tag === tag.slug ? 'default' : 'outline'} size="sm" onClick={() => router.get('/documents', { tag: tag.slug, search: filters.search, category_id: filters.category_id, year: filters.year, file_type: filters.file_type })}>{tag.name}</Button>)}
                    </div>
                </div>
                <ul className="space-y-3">
                    {documents.data.map((document: any) => {
                        const translation = getTranslation(document, locale);

                        return (
                            <li key={document.id} className="flex items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:border-blue-300">
                                <div className="flex items-start gap-3">
                                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                                    <div>
                                        <p className="font-medium text-gray-900">{translation.title ?? t(locale, 'common.document')}</p>
                                        {translation.description && <p className="text-sm text-gray-500 mt-0.5">{translation.description}</p>}
                                        <div className="mt-1 flex items-center gap-2">
                                            {document.category && <Badge variant="outline" className="text-xs">{document.category.name}</Badge>}
                                            {document.file_type && <span className="text-xs text-gray-400 uppercase">{document.file_type}</span>}
                                            {document.file_size && <span className="text-xs text-gray-400">{formatSize(document.file_size)}</span>}
                                        </div>
                                        {document.tags?.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {document.tags.map((tag: any) => (
                                                    <Badge key={tag.id} variant="secondary" className="text-xs">
                                                        {tag.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm" className="shrink-0">
                                    <Link href={`/documents/${document.id}/download`}>
                                        <Download className="mr-1.5 h-4 w-4" /> {t(locale, 'common.download')}
                                    </Link>
                                </Button>
                            </li>
                        );
                    })}
                </ul>
                {documents.data.length === 0 && <p className="py-12 text-center text-gray-500">{t(locale, 'documents.empty')}</p>}
            </div>
        </PublicLayout>
    );
}

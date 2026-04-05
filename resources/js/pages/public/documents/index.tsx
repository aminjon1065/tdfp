import { router, usePage } from '@inertiajs/react';
import { Download, FileText, Search } from 'lucide-react';
import { useState } from 'react';

import PageHero from '@/components/page-hero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { getTranslation, t } from '@/lib/i18n';
import { publicLocaleQuery } from '@/lib/public-locale';

function formatSize(bytes: number): string {
    if (!bytes) return '';
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
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const localeQuery = publicLocaleQuery(locale, defaultLocale);
    const [search, setSearch] = useState(filters.search ?? '');
    const [previewDoc, setPreviewDoc] = useState<any>(null);
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
            itemListElement: documents.data.map(
                (document: any, index: number) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name:
                        getTranslation(document, locale).title ??
                        t(locale, 'common.document'),
                    url: currentUrl
                        ? new URL(
                              `/documents/${document.id}/download`,
                              currentUrl,
                          ).toString()
                        : undefined,
                }),
            ),
        },
    ];

    return (
        <PublicLayout
            title={t(locale, 'documents.title')}
            description={t(locale, 'documents.indexDescription')}
            structuredData={structuredData}
            seoType="website"
            blendHeader
        >
            <PageHero
                title={t(locale, 'documents.indexTitle')}
                subtitle={t(locale, 'documents.title')}
                description={t(locale, 'documents.indexDescription')}
                compact
            />
            <div className="container mx-auto space-y-8 px-4 py-12">
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get('/documents', {
                                ...localeQuery,
                                search,
                                category_id: filters.category_id,
                                year: filters.year,
                                file_type: filters.file_type,
                                tag: filters.tag,
                            });
                        }}
                        className="flex flex-col gap-3 sm:flex-row"
                        role="search"
                        aria-label={t(locale, 'documents.indexTitle')}
                    >
                        <label
                            htmlFor="document-search-query"
                            className="sr-only"
                        >
                            {t(locale, 'documents.searchPlaceholder')}
                        </label>
                        <Input
                            id="document-search-query"
                            name="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t(
                                locale,
                                'documents.searchPlaceholder',
                            )}
                            className="w-full sm:w-64"
                        />
                        <Button
                            type="submit"
                            variant="outline"
                            size="icon"
                            aria-label={t(locale, 'documents.indexTitle')}
                            className="w-full sm:w-10"
                        >
                            <Search className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </form>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="document-year-filter"
                                className="sr-only"
                            >
                                {t(locale, 'common.filterByYear')}
                            </label>
                            <select
                                id="document-year-filter"
                                value={filters.year ?? ''}
                                onChange={(event) =>
                                    router.get('/documents', {
                                        ...localeQuery,
                                        search: filters.search,
                                        category_id: filters.category_id,
                                        year: event.target.value || undefined,
                                        file_type: filters.file_type,
                                        tag: filters.tag,
                                    })
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="">
                                    {t(locale, 'common.all')}
                                </option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="document-file-type-filter"
                                className="sr-only"
                            >
                                {t(locale, 'common.filterByFileType')}
                            </label>
                            <select
                                id="document-file-type-filter"
                                value={filters.file_type ?? ''}
                                onChange={(event) =>
                                    router.get('/documents', {
                                        ...localeQuery,
                                        search: filters.search,
                                        category_id: filters.category_id,
                                        year: filters.year,
                                        file_type:
                                            event.target.value || undefined,
                                        tag: filters.tag,
                                    })
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm uppercase"
                            >
                                <option value="">
                                    {t(locale, 'common.all')}
                                </option>
                                {fileTypes.map((fileType) => (
                                    <option key={fileType} value={fileType}>
                                        {fileType}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={
                                !filters.category_id ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() =>
                                router.get('/documents', {
                                    ...localeQuery,
                                    search: filters.search,
                                    year: filters.year,
                                    file_type: filters.file_type,
                                    tag: filters.tag,
                                })
                            }
                        >
                            {t(locale, 'common.all')}
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={
                                    filters.category_id == category.id
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                    router.get('/documents', {
                                        ...localeQuery,
                                        category_id: category.id,
                                        search: filters.search,
                                        year: filters.year,
                                        file_type: filters.file_type,
                                        tag: filters.tag,
                                    })
                                }
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={!filters.tag ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                                router.get('/documents', {
                                    ...localeQuery,
                                    search: filters.search,
                                    category_id: filters.category_id,
                                    year: filters.year,
                                    file_type: filters.file_type,
                                })
                            }
                        >
                            {t(locale, 'common.all')}
                        </Button>
                        {tags.map((tag) => (
                            <Button
                                key={tag.id}
                                variant={
                                    filters.tag === tag.slug
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                    router.get('/documents', {
                                        ...localeQuery,
                                        tag: tag.slug,
                                        search: filters.search,
                                        category_id: filters.category_id,
                                        year: filters.year,
                                        file_type: filters.file_type,
                                    })
                                }
                            >
                                {tag.name}
                            </Button>
                        ))}
                    </div>
                </section>
                <ul className="space-y-4">
                    {documents.data.map((document: any) => {
                        const translation = getTranslation(document, locale);

                        return (
                            <li
                                key={document.id}
                                className="flex cursor-pointer items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[var(--public-accent)]/30"
                                onClick={() => setPreviewDoc(document)}
                            >
                                <div className="flex items-start gap-3">
                                    <FileText
                                        className="mt-0.5 h-5 w-5 shrink-0 text-[var(--public-accent)]"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {translation.title ??
                                                t(locale, 'common.document')}
                                        </p>
                                        {translation.description && (
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                {translation.description}
                                            </p>
                                        )}
                                        <div className="mt-1 flex items-center gap-2">
                                            {document.category && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {document.category.name}
                                                </Badge>
                                            )}
                                            {document.file_type && (
                                                <span className="text-xs text-gray-400 uppercase">
                                                    {document.file_type}
                                                </span>
                                            )}
                                            {document.file_size && (
                                                <span className="text-xs text-gray-400">
                                                    {formatSize(
                                                        document.file_size,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        {document.tags?.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {document.tags.map(
                                                    (tag: any) => (
                                                        <Badge
                                                            key={tag.id}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {tag.name}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="pointer-events-none shrink-0"
                                >
                                    <FileText className="mr-1.5 h-4 w-4" />{' '}
                                    {t(locale, 'common.view')}
                                </Button>
                            </li>
                        );
                    })}
                </ul>
                {documents.data.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-gray-500">
                        {t(locale, 'documents.empty')}
                    </div>
                )}
            </div>

            <DocumentPreviewModal
                document={previewDoc}
                locale={locale}
                onClose={() => setPreviewDoc(null)}
                tFn={t}
            />
        </PublicLayout>
    );
}

function DocumentPreviewModal({
    document,
    locale,
    onClose,
    tFn,
}: {
    document: any;
    locale: string;
    onClose: () => void;
    tFn: typeof t;
}) {
    if (!document) return null;

    const translation = getTranslation(document, locale);
    const title = translation.title ?? tFn(locale, 'common.document');
    const type = document.file_type?.toLowerCase() ?? '';
    const fileAbsUrl = `${window.location.origin}/storage/${document.file_path}`;

    const officeTypes = ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt'];
    const isPdf = type === 'pdf';
    const isOffice = officeTypes.includes(type);
    const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileAbsUrl)}`;

    return (
        <Dialog
            open={!!document}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="flex h-[90vh] w-full max-w-5xl flex-col gap-0 p-0">
                <DialogHeader className="shrink-0 flex-row items-center justify-between border-b px-6 py-4">
                    <DialogTitle className="line-clamp-1 pr-4 text-base font-semibold">
                        {title}
                    </DialogTitle>
                    <a
                        href={`/documents/${document.id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button size="sm" variant="outline">
                            <Download className="mr-1.5 h-4 w-4" />
                            {tFn(locale, 'common.download')}
                        </Button>
                    </a>
                </DialogHeader>

                <div className="flex-1 overflow-hidden bg-slate-100">
                    {isPdf && (
                        <object
                            data={`/storage/${document.file_path}`}
                            type="application/pdf"
                            className="h-full w-full"
                        >
                            <iframe
                                src={`/storage/${document.file_path}`}
                                className="h-full w-full border-0"
                                title={title}
                            />
                        </object>
                    )}
                    {isOffice && (
                        <iframe
                            src={officeViewerUrl}
                            className="h-full w-full border-0"
                            title={title}
                            sandbox="allow-scripts allow-same-origin allow-popups"
                        />
                    )}
                    {!isPdf && !isOffice && (
                        <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-500">
                            <FileText className="h-16 w-16 text-slate-300" />
                            <p className="text-sm">
                                {tFn(locale, 'documents.previewUnavailable')}
                            </p>
                            <a
                                href={`/documents/${document.id}/download`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button>
                                    <Download className="mr-1.5 h-4 w-4" />
                                    {tFn(locale, 'common.download')}
                                </Button>
                            </a>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

import type { PageProps } from '@inertiajs/core';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';

import PageHero from '@/components/page-hero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { t } from '@/lib/i18n';
import { type Paginator, type SharedData } from '@/types';

interface SearchResult {
    id: number;
    entity_type: string;
    entity_label_key: string | null;
    title: string;
    snippet: string | null;
    url: string | null;
}

interface SearchFilters {
    entity_type?: string;
    lang: string;
}

interface SearchEntityType {
    value: string;
    label_key: string;
    count: number;
}

interface SearchPageProps extends PageProps, SharedData {
    filters: SearchFilters;
    query: string;
    results: Paginator<SearchResult> | null;
    entityTypes: SearchEntityType[];
    ziggy?: {
        location?: string;
    };
}

interface Props {
    results: Paginator<SearchResult> | null;
    query: string;
    filters: SearchFilters;
    entityTypes: SearchEntityType[];
}

export default function SearchPage({
    results,
    query,
    filters,
    entityTypes,
}: Props) {
    const { props } = usePage<SearchPageProps>();
    const locale = props.locale ?? 'en';
    const currentUrl = props.ziggy?.location ?? '';
    const resultItems = results?.data ?? [];
    const resultLinks = results?.links ?? [];
    const hasResults = resultItems.length > 0;
    const hasPagination = (results?.last_page ?? 0) > 1;
    const { data, setData, processing } = useForm({
        q: query ?? '',
        entity_type: filters.entity_type ?? '',
    });
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'SearchResultsPage',
            name: t(locale, 'search.title'),
            description: t(locale, 'search.description'),
            inLanguage: locale,
            url: currentUrl || undefined,
            mainEntity: hasResults
                ? {
                      '@type': 'ItemList',
                      itemListElement: resultItems.map((item, index) => ({
                          '@type': 'ListItem',
                          position: index + 1,
                          name: item.title,
                          url: item.url,
                      })),
                  }
                : undefined,
        },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/search', {
            q: data.q,
            entity_type: data.entity_type,
            lang: filters.lang,
        });
    };

    return (
        <PublicLayout
            title={t(locale, 'search.title')}
            description={t(locale, 'search.description')}
            structuredData={structuredData}
            blendHeader
        >
            <PageHero
                title={t(locale, 'search.title')}
                subtitle={t(locale, 'common.search')}
                description={t(locale, 'search.description')}
                compact
            />
            <div className="container mx-auto max-w-3xl px-4 py-12">
                <form
                    onSubmit={handleSearch}
                    className="mb-8 flex flex-col gap-3 sm:flex-row"
                    role="search"
                    aria-label={t(locale, 'search.title')}
                >
                    <label htmlFor="site-search-query" className="sr-only">
                        {t(locale, 'search.title')}
                    </label>
                    <Input
                        id="site-search-query"
                        name="q"
                        value={data.q}
                        onChange={(e) => setData('q', e.target.value)}
                        placeholder={t(locale, 'search.placeholder')}
                        className="w-full flex-1"
                        autoFocus
                    />
                    <label
                        htmlFor="site-search-entity-type"
                        className="sr-only"
                    >
                        {t(locale, 'search.filterByType')}
                    </label>
                    <select
                        id="site-search-entity-type"
                        name="entity_type"
                        value={data.entity_type}
                        onChange={(e) => setData('entity_type', e.target.value)}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:w-56"
                    >
                        <option value="">{t(locale, 'common.all')}</option>
                        {entityTypes.map((entityType) => (
                            <option
                                key={entityType.value}
                                value={entityType.value}
                            >
                                {t(locale, entityType.label_key)}
                            </option>
                        ))}
                    </select>
                    <Button
                        type="submit"
                        disabled={processing}
                        aria-label={t(locale, 'search.title')}
                        className="w-full sm:w-auto"
                    >
                        <Search className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </form>

                {entityTypes.length > 0 && (
                    <div
                        className="mb-6 flex flex-wrap gap-2"
                        aria-label={t(locale, 'search.filterByType')}
                    >
                        <Button
                            variant={
                                !filters.entity_type ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() =>
                                router.get('/search', {
                                    q: data.q,
                                    lang: filters.lang,
                                })
                            }
                        >
                            {t(locale, 'common.all')}
                            {query ? ` (${results?.total ?? 0})` : ''}
                        </Button>
                        {entityTypes.map((entityType) => (
                            <Button
                                key={entityType.value}
                                variant={
                                    filters.entity_type === entityType.value
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                    router.get('/search', {
                                        q: data.q,
                                        entity_type: entityType.value,
                                        lang: filters.lang,
                                    })
                                }
                            >
                                {t(locale, entityType.label_key)}
                                {query ? ` (${entityType.count})` : ''}
                            </Button>
                        ))}
                    </div>
                )}

                {query && results && (
                    <p
                        className="mb-4 text-sm text-gray-500"
                        role="status"
                        aria-live="polite"
                    >
                        {results.total} {t(locale, 'search.resultsFor')}{' '}
                        <strong>"{query}"</strong>
                    </p>
                )}

                {hasResults ? (
                    <ol className="space-y-4">
                        {resultItems.map((item) => (
                            <li
                                key={item.id}
                                className="rounded-lg border p-4 transition-colors hover:border-blue-300"
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {t(locale, item.entity_label_key ?? '')}
                                    </Badge>
                                </div>
                                <h3 className="font-medium text-gray-900">
                                    {item.title}
                                </h3>
                                {item.snippet && (
                                    <p className="mt-1 line-clamp-3 text-sm text-gray-500">
                                        {item.snippet}
                                    </p>
                                )}
                                {item.url && (
                                    <Link
                                        href={item.url}
                                        className="mt-2 flex items-center text-sm text-blue-700 hover:underline"
                                    >
                                        {t(locale, 'common.view')} →
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ol>
                ) : query ? (
                    <p
                        className="py-12 text-center text-gray-500"
                        role="status"
                        aria-live="polite"
                    >
                        {t(locale, 'search.noResults')} "{query}".
                    </p>
                ) : null}

                {hasPagination && results ? (
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500">
                            {t(locale, 'search.page')} {results.current_page}{' '}
                            {t(locale, 'search.of')} {results.last_page} (
                            {results.total} {t(locale, 'search.total')})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {resultLinks.map((link, index) => (
                                <Button
                                    key={`${link.label}-${index}`}
                                    type="button"
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url && router.visit(link.url)
                                    }
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </PublicLayout>
    );
}

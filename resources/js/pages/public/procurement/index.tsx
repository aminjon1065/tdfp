import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getProcurementProcessLabel, getStatusLabel, getTranslation, t } from '@/lib/i18n';
import { Link, router, usePage } from '@inertiajs/react';
import { Calendar, FileText, Search } from 'lucide-react';
import { useState } from 'react';

export default function ProcurementIndex({ procurements, filters, years }: { procurements: any; filters: any; years: number[] }) {
    const locale = (usePage().props as any).locale ?? 'en';
    const currentUrl = (usePage().props as any).ziggy?.location ?? '';
    const statuses = ['', 'open', 'closed', 'awarded', 'archived'];
    const [search, setSearch] = useState(filters.search ?? '');
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: t(locale, 'procurement.title'),
            description: t(locale, 'procurement.indexDescription'),
            inLanguage: locale,
            url: currentUrl || undefined,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: t(locale, 'procurement.title'),
            itemListElement: procurements.data.map((item: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: currentUrl ? new URL(`/procurement/${item.reference_number}`, currentUrl).toString() : undefined,
                name: getTranslation(item, locale).title ?? item.reference_number,
            })),
        },
    ];

    return (
        <PublicLayout
            title={t(locale, 'procurement.title')}
            description={t(locale, 'procurement.indexDescription')}
            structuredData={structuredData}
            seoType="website"
        >
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{t(locale, 'procurement.title')}</h1>
                <p className="mb-8 text-gray-500">{t(locale, 'procurement.indexDescription')}</p>

                <div className="mb-4 space-y-3">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get('/procurement', {
                                search,
                                status: filters.status,
                                year: filters.year,
                            });
                        }}
                        className="flex flex-col gap-3 sm:flex-row"
                        role="search"
                        aria-label={t(locale, 'procurement.title')}
                    >
                        <label htmlFor="procurement-search-query" className="sr-only">
                            {t(locale, 'procurement.searchPlaceholder')}
                        </label>
                        <Input
                            id="procurement-search-query"
                            name="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t(locale, 'procurement.searchPlaceholder')}
                            className="w-full sm:w-64"
                        />
                        <Button type="submit" variant="outline" size="icon" aria-label={t(locale, 'procurement.title')} className="w-full sm:w-10">
                            <Search className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </form>

                    <div className="sm:max-w-xs">
                        <label htmlFor="procurement-year-filter" className="sr-only">Filter by year</label>
                        <select
                            id="procurement-year-filter"
                            value={filters.year ?? ''}
                            onChange={(event) =>
                                router.get('/procurement', {
                                    search: filters.search,
                                    status: filters.status,
                                    year: event.target.value || undefined,
                                })}
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
                </div>

                <div className="mb-6 flex gap-2 flex-wrap">
                    {statuses.map((status) => (
                        <Button key={status} variant={filters.status === status || (! status && ! filters.status) ? 'default' : 'outline'} size="sm" onClick={() => router.get('/procurement', { status: status || undefined, search: filters.search, year: filters.year })}>
                            {status ? getStatusLabel(status, locale) : t(locale, 'common.all')}
                        </Button>
                    ))}
                </div>

                <ul className="space-y-4">
                    {procurements.data.map((item: any) => {
                        const translation = getTranslation(item, locale);

                        return (
                            <li key={item.id} className="rounded-lg border p-5 transition-colors hover:border-blue-300">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant={item.status === 'open' ? 'default' : 'secondary'}>{getStatusLabel(item.status, locale)}</Badge>
                                            <Badge variant="outline">{getProcurementProcessLabel(item.process_state, locale)}</Badge>
                                            <span className="text-sm text-gray-500">{item.reference_number}</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{translation.title ?? t(locale, 'common.untitled')}</h3>
                                        {translation.description && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{translation.description}</p>}
                                        <p className="mt-2 text-sm font-medium text-slate-700">{t(locale, item.process_summary_key)}</p>
                                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                            {item.publication_date && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" aria-hidden="true" /> {t(locale, 'common.published')}: <time dateTime={item.publication_date}>{formatLocalizedDate(item.publication_date, locale)}</time>
                                                </span>
                                            )}
                                            {item.deadline && (
                                                <span className="flex items-center gap-1 text-orange-600 font-medium">
                                                    <Calendar className="h-3 w-3" aria-hidden="true" /> {t(locale, 'common.deadline')}: <time dateTime={item.deadline}>{formatLocalizedDate(item.deadline, locale)}</time>
                                                </span>
                                            )}
                                            {item.days_until_deadline !== null && (
                                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                                                    {item.days_until_deadline} {t(locale, 'procurement.daysRemaining')}
                                                </span>
                                            )}
                                            {item.deadline_passed && (
                                                <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                                                    {t(locale, 'procurement.deadlinePassed')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="shrink-0">
                                        <Link href={`/procurement/${item.reference_number}`}>
                                            <FileText className="mr-1.5 h-4 w-4" /> {t(locale, 'common.view')}
                                        </Link>
                                    </Button>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {procurements.data.length === 0 && (
                    <p className="py-12 text-center text-gray-500">{t(locale, 'procurement.empty')}</p>
                )}
            </div>
        </PublicLayout>
    );
}

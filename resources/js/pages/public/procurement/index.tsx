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
    const statuses = ['', 'open', 'closed', 'awarded', 'archived'];
    const [search, setSearch] = useState(filters.search ?? '');
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: t(locale, 'procurement.title'),
        description: t(locale, 'procurement.indexDescription'),
        inLanguage: locale,
    };

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

                <div className="mb-4 flex flex-wrap gap-3">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get('/procurement', {
                                search,
                                status: filters.status,
                                year: filters.year,
                            });
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t(locale, 'procurement.searchPlaceholder')}
                            className="w-64"
                        />
                        <Button type="submit" variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>

                    <select
                        value={filters.year ?? ''}
                        onChange={(event) =>
                            router.get('/procurement', {
                                search: filters.search,
                                status: filters.status,
                                year: event.target.value || undefined,
                            })}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">{t(locale, 'common.all')}</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6 flex gap-2 flex-wrap">
                    {statuses.map((status) => (
                        <Button key={status} variant={filters.status === status || (! status && ! filters.status) ? 'default' : 'outline'} size="sm" onClick={() => router.get('/procurement', { status: status || undefined, search: filters.search, year: filters.year })}>
                            {status ? getStatusLabel(status, locale) : t(locale, 'common.all')}
                        </Button>
                    ))}
                </div>

                <div className="space-y-4">
                    {procurements.data.map((item: any) => {
                        const translation = getTranslation(item, locale);

                        return (
                            <div key={item.id} className="rounded-lg border p-5 hover:border-blue-300 transition-colors">
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
                                                    <Calendar className="h-3 w-3" /> {t(locale, 'common.published')}: {formatLocalizedDate(item.publication_date, locale)}
                                                </span>
                                            )}
                                            {item.deadline && (
                                                <span className="flex items-center gap-1 text-orange-600 font-medium">
                                                    <Calendar className="h-3 w-3" /> {t(locale, 'common.deadline')}: {formatLocalizedDate(item.deadline, locale)}
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
                            </div>
                        );
                    })}
                </div>

                {procurements.data.length === 0 && (
                    <p className="py-12 text-center text-gray-500">{t(locale, 'procurement.empty')}</p>
                )}
            </div>
        </PublicLayout>
    );
}

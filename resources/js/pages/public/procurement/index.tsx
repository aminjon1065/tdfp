import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getStatusLabel, getTranslation, t } from '@/lib/i18n';
import { Link, router, usePage } from '@inertiajs/react';
import { Calendar, FileText } from 'lucide-react';

export default function ProcurementIndex({ procurements, filters }: { procurements: any; filters: any }) {
    const locale = (usePage().props as any).locale ?? 'en';
    const statuses = ['', 'open', 'closed', 'awarded', 'archived'];

    return (
        <PublicLayout title={t(locale, 'procurement.title')}>
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{t(locale, 'procurement.title')}</h1>
                <p className="mb-8 text-gray-500">{t(locale, 'procurement.indexDescription')}</p>

                <div className="mb-6 flex gap-2 flex-wrap">
                    {statuses.map((status) => (
                        <Button key={status} variant={filters.status === status || (! status && ! filters.status) ? 'default' : 'outline'} size="sm" onClick={() => router.get('/procurement', status ? { status } : {})}>
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
                                            <span className="text-sm text-gray-500">{item.reference_number}</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{translation.title ?? t(locale, 'common.untitled')}</h3>
                                        {translation.description && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{translation.description}</p>}
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

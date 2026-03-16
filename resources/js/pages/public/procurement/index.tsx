import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, FileText } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';

export default function ProcurementIndex({ procurements, filters }: { procurements: any; filters: any }) {
    const locale = (usePage().props as any).locale ?? 'en';
    const statuses = ['', 'open', 'closed', 'awarded', 'archived'];

    return (
        <PublicLayout title="Procurement">
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Procurement</h1>
                <p className="mb-8 text-gray-500">Notices, RFQs, RFPs and contract awards</p>

                <div className="mb-6 flex gap-2 flex-wrap">
                    {statuses.map((s) => (
                        <Button key={s} variant={filters.status === s || (!s && !filters.status) ? 'default' : 'outline'} size="sm"
                            onClick={() => router.get('/procurement', s ? { status: s } : {})}>
                            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
                        </Button>
                    ))}
                </div>

                <div className="space-y-4">
                    {procurements.data.map((item: any) => {
                        const t = getTranslation(item, locale);
                        return (
                            <div key={item.id} className="rounded-lg border p-5 hover:border-blue-300 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant={item.status === 'open' ? 'default' : 'secondary'}>{item.status}</Badge>
                                            <span className="text-sm text-gray-500">{item.reference_number}</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{t.title ?? 'Untitled'}</h3>
                                        {t.description && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{t.description}</p>}
                                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                            {item.publication_date && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Published: {new Date(item.publication_date).toLocaleDateString()}
                                                </span>
                                            )}
                                            {item.deadline && (
                                                <span className="flex items-center gap-1 text-orange-600 font-medium">
                                                    <Calendar className="h-3 w-3" /> Deadline: {new Date(item.deadline).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="shrink-0">
                                        <Link href={`/procurement/${item.reference_number}`}>
                                            <FileText className="mr-1.5 h-4 w-4" /> View
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {procurements.data.length === 0 && (
                    <p className="py-12 text-center text-gray-500">No procurement notices found.</p>
                )}
            </div>
        </PublicLayout>
    );
}

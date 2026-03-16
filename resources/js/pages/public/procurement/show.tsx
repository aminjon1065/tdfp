import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getStatusLabel, getTranslation, t } from '@/lib/i18n';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, ChevronRight, Download, FileText } from 'lucide-react';

function formatSize(bytes: number): string {
    if (! bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProcurementShow({ procurement }: { procurement: any }) {
    const locale = (usePage().props as any).locale ?? 'en';
    const translation = getTranslation(procurement, locale);

    return (
        <PublicLayout title={translation.title ?? t(locale, 'procurement.notice')}>
            <div style={{ backgroundColor: '#1B3A6B' }} className="py-8">
                <div className="container mx-auto px-4">
                    <nav className="mb-2 flex items-center gap-1 text-xs text-blue-300">
                        <Link href="/" className="hover:text-white transition-colors">{t(locale, 'common.home')}</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/procurement" className="hover:text-white transition-colors">{t(locale, 'procurement.title')}</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-white">{procurement.reference_number}</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">{translation.title ?? t(locale, 'procurement.notice')}</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href="/procurement" className="mb-6 inline-flex items-center text-sm font-medium hover:underline" style={{ color: '#1B3A6B' }}>
                    {t(locale, 'procurement.back')}
                </Link>

                <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ backgroundColor: '#1B3A6B', color: '#FFFFFF' }}>
                            {getStatusLabel(procurement.status, locale)}
                        </span>
                        <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-mono font-semibold" style={{ borderColor: '#1B3A6B', color: '#1B3A6B' }}>
                            {procurement.reference_number}
                        </span>
                    </div>

                    <h2 className="text-xl font-bold mb-4" style={{ color: '#1A1A2E' }}>{translation.title ?? t(locale, 'common.untitled')}</h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {procurement.publication_date && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 shrink-0" style={{ color: '#1B3A6B' }} />
                                <span><span className="font-medium">{t(locale, 'common.published')}:</span> {formatLocalizedDate(procurement.publication_date, locale)}</span>
                            </div>
                        )}
                        {procurement.deadline && (
                            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#C4922A' }}>
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span><span>{t(locale, 'common.deadline')}:</span> {formatLocalizedDate(procurement.deadline, locale)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {translation.description && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-3" style={{ color: '#1B3A6B' }}>{t(locale, 'common.description')}</h3>
                        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: translation.description }} />
                    </div>
                )}

                {procurement.documents && procurement.documents.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1B3A6B' }}>{t(locale, 'common.attachedDocuments')}</h3>
                        <div className="space-y-3">
                            {procurement.documents.map((document: any) => (
                                <div key={document.id} className="flex items-center justify-between gap-4 rounded-lg border bg-white p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 shrink-0" style={{ color: '#1B3A6B' }} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{document.title ?? `${t(locale, 'common.document')} ${document.id}`}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {document.file_type && <span className="text-xs text-gray-400 uppercase">{document.file_type}</span>}
                                                {document.file_size && <span className="text-xs text-gray-400">{formatSize(document.file_size)}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    {document.file_path && (
                                        <Button asChild variant="outline" size="sm" className="shrink-0">
                                            <a href={`/storage/${document.file_path}`} download>
                                                <Download className="mr-1.5 h-4 w-4" />
                                                {t(locale, 'common.download')}
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

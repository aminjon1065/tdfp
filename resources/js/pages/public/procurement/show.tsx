import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import { getTranslation } from '@/lib/i18n';
import { Calendar, Download, FileText, ChevronRight } from 'lucide-react';

interface ProcurementDocument {
    id: number;
    title?: string;
    file_path?: string;
    file_type?: string;
    file_size?: number;
}

interface Props {
    procurement: {
        id: number;
        reference_number: string;
        status: string;
        publication_date?: string;
        deadline?: string;
        translations: { language: string; title: string; description?: string }[];
        documents?: ProcurementDocument[];
    };
}

const statusStyle: Record<string, { bg: string; text: string }> = {
    open: { bg: '#16a34a', text: '#FFFFFF' },
    closed: { bg: '#6b7280', text: '#FFFFFF' },
    awarded: { bg: '#1B3A6B', text: '#FFFFFF' },
    archived: { bg: '#9ca3af', text: '#FFFFFF' },
};

function formatSize(bytes: number): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProcurementShow({ procurement }: Props) {
    const locale = (usePage().props as any).locale ?? 'en';
    const t = getTranslation(procurement, locale);

    const style = statusStyle[procurement.status] ?? { bg: '#6b7280', text: '#FFFFFF' };

    return (
        <PublicLayout title={t.title ?? 'Procurement Notice'}>
            {/* Page Banner */}
            <div style={{ backgroundColor: '#1B3A6B' }} className="py-8">
                <div className="container mx-auto px-4">
                    <nav className="mb-2 flex items-center gap-1 text-xs text-blue-300">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/procurement" className="hover:text-white transition-colors">Procurement</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-white">{procurement.reference_number}</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">{t.title ?? 'Procurement Notice'}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link
                    href="/procurement"
                    className="mb-6 inline-flex items-center text-sm font-medium hover:underline"
                    style={{ color: '#1B3A6B' }}
                >
                    ← Back to Procurement
                </Link>

                {/* Meta card */}
                <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {/* Status Badge */}
                        <span
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                            style={{ backgroundColor: style.bg, color: style.text }}
                        >
                            {procurement.status}
                        </span>
                        {/* Reference Number */}
                        <span
                            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-mono font-semibold"
                            style={{ borderColor: '#1B3A6B', color: '#1B3A6B' }}
                        >
                            {procurement.reference_number}
                        </span>
                    </div>

                    <h2 className="text-xl font-bold mb-4" style={{ color: '#1A1A2E' }}>
                        {t.title ?? 'Untitled Notice'}
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {procurement.publication_date && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 shrink-0" style={{ color: '#1B3A6B' }} />
                                <span>
                                    <span className="font-medium">Published:</span>{' '}
                                    {new Date(procurement.publication_date).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        {procurement.deadline && (
                            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#C4922A' }}>
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span>
                                    <span>Deadline:</span>{' '}
                                    {new Date(procurement.deadline).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                {t.description && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-3" style={{ color: '#1B3A6B' }}>Description</h3>
                        <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: t.description }}
                        />
                    </div>
                )}

                {/* Documents */}
                {procurement.documents && procurement.documents.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1B3A6B' }}>
                            Attached Documents
                        </h3>
                        <div className="space-y-3">
                            {procurement.documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between gap-4 rounded-lg border bg-white p-4 hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 shrink-0" style={{ color: '#1B3A6B' }} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {doc.title ?? `Document ${doc.id}`}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {doc.file_type && (
                                                    <span className="text-xs text-gray-400 uppercase">{doc.file_type}</span>
                                                )}
                                                {doc.file_size && (
                                                    <span className="text-xs text-gray-400">{formatSize(doc.file_size)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {doc.file_path && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="shrink-0"
                                        >
                                            <a href={`/storage/${doc.file_path}`} download>
                                                <Download className="mr-1.5 h-4 w-4" />
                                                Download
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

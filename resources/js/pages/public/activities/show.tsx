import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';

export default function ActivityShow({ activity }: { activity: any }) {
    const locale = (usePage().props as any).locale ?? 'en';
    const t = getTranslation(activity, locale);

    return (
        <PublicLayout title={t.title ?? 'Activity'}>
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href="/activities" className="mb-6 inline-flex text-sm text-blue-700 hover:underline">← Back to Activities</Link>
                <Badge variant={activity.status === 'in_progress' ? 'default' : 'secondary'} className="mb-3">
                    {activity.status?.replace('_', ' ')}
                </Badge>
                <h1 className="mb-4 text-3xl font-bold text-gray-900">{t.title}</h1>
                {(activity.start_date || activity.end_date) && (
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {activity.start_date} {activity.end_date ? `– ${activity.end_date}` : ''}
                    </div>
                )}
                {activity.featured_image && (
                    <img src={`/storage/${activity.featured_image}`} alt={t.title} className="mb-6 w-full rounded-lg object-cover max-h-80" />
                )}
                {t.description && (
                    <div className="mb-6 prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: t.description }} />
                )}
                {t.objectives && (
                    <div className="mb-6 rounded-lg bg-blue-50 p-4">
                        <h2 className="mb-2 font-semibold text-blue-900">Objectives</h2>
                        <div className="prose text-sm text-blue-800" dangerouslySetInnerHTML={{ __html: t.objectives }} />
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

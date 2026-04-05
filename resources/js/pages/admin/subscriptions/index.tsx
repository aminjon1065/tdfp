import { Head, Link, router, usePage } from '@inertiajs/react';
import { Download } from 'lucide-react';

import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { formatLocalizedDate, t } from '@/lib/i18n';
import { type SharedData } from '@/types';

interface SubscriberRow {
    id: number;
    email: string;
    status: string;
    locale: string;
    confirmed_at: string | null;
    unsubscribed_at: string | null;
}

export default function AdminSubscriptionsIndex({
    subscribers,
    filters,
}: {
    subscribers: any;
    filters: Record<string, string>;
}) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    const columns = [
        {
            key: 'email',
            header: t(locale, 'common.email'),
            render: (row: SubscriberRow) => row.email,
        },
        {
            key: 'status',
            header: t(locale, 'common.status'),
            render: (row: SubscriberRow) =>
                t(locale, `status.${row.status}`, row.status),
        },
        {
            key: 'locale',
            header: t(locale, 'common.locale'),
            render: (row: SubscriberRow) => row.locale.toUpperCase(),
        },
        {
            key: 'confirmed_at',
            header: t(locale, 'common.confirmed'),
            render: (row: SubscriberRow) =>
                row.confirmed_at
                    ? formatLocalizedDate(row.confirmed_at, locale)
                    : '—',
        },
    ];

    return (
        <AdminLayout
            breadcrumbs={[
                {
                    title: t(locale, 'admin.content.subscriptions'),
                    href: '/admin/subscriptions',
                },
            ]}
        >
            <Head title={t(locale, 'admin.content.subscriptions')} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t(locale, 'admin.content.subscriptions')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t(locale, 'admin.content.reviewSubscriptions')}
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link
                            href={`/admin/subscriptions/export?status=${filters.status ?? ''}&search=${filters.search ?? ''}`}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            {t(locale, 'admin.content.exportCsv')}
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'active', 'unsubscribed'].map(
                        (status) => (
                            <Button
                                key={status}
                                variant={
                                    filters.status === status ||
                                    (status === 'all' && !filters.status)
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() =>
                                    router.get('/admin/subscriptions', {
                                        ...filters,
                                        status:
                                            status === 'all'
                                                ? undefined
                                                : status,
                                    })
                                }
                            >
                                {status === 'all'
                                    ? t(locale, 'common.all')
                                    : t(locale, `status.${status}`, status)}
                            </Button>
                        ),
                    )}
                </div>

                <DataTable
                    data={subscribers}
                    columns={columns}
                    searchable
                    onSearch={(search) =>
                        router.get('/admin/subscriptions', {
                            ...filters,
                            search,
                        })
                    }
                />
            </div>
        </AdminLayout>
    );
}

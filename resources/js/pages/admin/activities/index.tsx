import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { type SharedData } from '@/types';

interface Props {
    activities: any;
    filters: any;
}

export default function AdminActivitiesIndex({ activities }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    const columns = [
        {
            key: 'title',
            header: t(locale, 'common.title'),
            render: (row: any) =>
                getTranslation(row, locale).title ??
                t(locale, 'admin.content.untitled'),
        },
        {
            key: 'status',
            header: t(locale, 'common.status'),
            render: (row: any) => <StatusBadge status={row.status} />,
        },
        {
            key: 'start_date',
            header: t(locale, 'admin.form.startDate'),
            render: (row: any) =>
                row.start_date
                    ? formatLocalizedDate(row.start_date, locale)
                    : '—',
        },
        {
            key: 'end_date',
            header: t(locale, 'admin.form.endDate'),
            render: (row: any) =>
                row.end_date ? formatLocalizedDate(row.end_date, locale) : '—',
        },
        {
            key: 'actions',
            header: t(locale, 'common.actions'),
            render: (row: any) => (
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/activities/${row.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (
                                confirm(
                                    `${t(locale, 'common.delete')} ${t(locale, 'admin.nav.activities').toLowerCase()}?`,
                                )
                            ) {
                                router.delete(`/admin/activities/${row.id}`);
                            }
                        }}
                    >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout
            breadcrumbs={[
                {
                    title: t(locale, 'admin.nav.activities'),
                    href: '/admin/activities',
                },
            ]}
        >
            <Head title={t(locale, 'admin.nav.activities')} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {t(locale, 'admin.nav.activities')}
                    </h1>
                    <Button asChild>
                        <Link href="/admin/activities/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t(locale, 'common.create')}{' '}
                            {t(locale, 'admin.nav.activities')}
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={activities}
                    columns={columns}
                    searchable
                    onSearch={(s) =>
                        router.get('/admin/activities', { search: s })
                    }
                />
            </div>
        </AdminLayout>
    );
}

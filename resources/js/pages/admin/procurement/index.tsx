import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { type SharedData } from '@/types';

interface Props {
    procurements: any;
    filters: any;
}

export default function AdminProcurementIndex({ procurements }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    const columns = [
        {
            key: 'reference_number',
            header: t(locale, 'common.reference'),
            render: (row: any) => (
                <span className="font-mono text-xs">
                    {row.reference_number ?? '—'}
                </span>
            ),
        },
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
            key: 'deadline',
            header: t(locale, 'admin.content.deadline'),
            render: (row: any) =>
                row.deadline ? formatLocalizedDate(row.deadline, locale) : '—',
        },
        {
            key: 'actions',
            header: t(locale, 'common.actions'),
            render: (row: any) => (
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/procurement/${row.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (
                                confirm(
                                    t(
                                        locale,
                                        'admin.content.deleteProcurement',
                                    ),
                                )
                            ) {
                                router.delete(`/admin/procurement/${row.id}`);
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
                    title: t(locale, 'admin.content.procurement'),
                    href: '/admin/procurement',
                },
            ]}
        >
            <Head title={t(locale, 'admin.content.procurement')} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {t(locale, 'admin.content.procurement')}
                    </h1>
                    <Button asChild>
                        <Link href="/admin/procurement/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t(locale, 'admin.content.addProcurement')}
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={procurements}
                    columns={columns}
                    searchable
                    onSearch={(s) =>
                        router.get('/admin/procurement', { search: s })
                    }
                />
            </div>
        </AdminLayout>
    );
}

import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye } from 'lucide-react';

import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { formatLocalizedDate, t } from '@/lib/i18n';
import { GrmCase, Paginator, type SharedData } from '@/types';

interface Props {
    cases: Paginator<GrmCase>;
    filters: { status?: string };
}

export default function AdminGrmIndex({ cases, filters }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const statusOptions = [
        { value: '', label: t(locale, 'admin.content.allStatuses') },
        { value: 'submitted', label: t(locale, 'status.submitted') },
        { value: 'under_review', label: t(locale, 'status.under_review') },
        { value: 'investigation', label: t(locale, 'status.investigation') },
        { value: 'resolved', label: t(locale, 'status.resolved') },
        { value: 'closed', label: t(locale, 'status.closed') },
    ];

    const columns = [
        {
            key: 'ticket_number',
            header: t(locale, 'admin.content.ticket'),
            render: (row: GrmCase) => (
                <span className="font-mono text-xs font-medium">
                    {row.ticket_number}
                </span>
            ),
        },
        {
            key: 'complainant_name',
            header: t(locale, 'admin.content.complainant'),
            render: (row: any) => row.complainant_name ?? '—',
        },
        {
            key: 'category',
            header: t(locale, 'common.category'),
            render: (row: any) => row.category ?? '—',
        },
        {
            key: 'status',
            header: t(locale, 'common.status'),
            render: (row: any) => <StatusBadge status={row.status} />,
        },
        {
            key: 'created_at',
            header: t(locale, 'admin.content.submitted'),
            render: (row: GrmCase) =>
                row.created_at
                    ? formatLocalizedDate(row.created_at, locale)
                    : '—',
        },
        {
            key: 'actions',
            header: t(locale, 'common.actions'),
            render: (row: GrmCase) => (
                <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/grm/${row.id}`}>
                        <Eye className="h-3.5 w-3.5" />
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <AdminLayout
            breadcrumbs={[
                { title: t(locale, 'admin.content.grm'), href: '/admin/grm' },
            ]}
        >
            <Head title={t(locale, 'admin.content.grm')} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {t(locale, 'admin.content.grm')}
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {t(locale, 'admin.content.filterByStatus')}
                    </span>
                    <div className="flex flex-wrap gap-1">
                        {statusOptions.map((opt) => (
                            <Button
                                key={opt.value}
                                variant={
                                    filters.status === opt.value ||
                                    (!filters.status && opt.value === '')
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        '/admin/grm',
                                        opt.value ? { status: opt.value } : {},
                                    )
                                }
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <DataTable
                    data={cases}
                    columns={columns}
                    searchable
                    onSearch={(s) =>
                        router.get('/admin/grm', {
                            search: s,
                            ...(filters.status
                                ? { status: filters.status }
                                : {}),
                        })
                    }
                />
            </div>
        </AdminLayout>
    );
}

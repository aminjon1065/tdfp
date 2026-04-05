import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { type SharedData } from '@/types';

interface Props {
    pages: any;
    filters: any;
}

export default function AdminPagesIndex({ pages }: Props) {
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
            key: 'published_at',
            header: t(locale, 'admin.content.published'),
            render: (row: any) =>
                row.published_at
                    ? formatLocalizedDate(row.published_at, locale)
                    : '—',
        },
        {
            key: 'actions',
            header: t(locale, 'common.actions'),
            render: (row: any) => (
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/pages/${row.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (
                                confirm(t(locale, 'admin.content.deletePage'))
                            ) {
                                router.delete(`/admin/pages/${row.id}`);
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
                    title: t(locale, 'admin.content.pages'),
                    href: '/admin/pages',
                },
            ]}
        >
            <Head title={t(locale, 'admin.content.pages')} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {t(locale, 'admin.content.pages')}
                    </h1>
                    <Button asChild>
                        <Link href="/admin/pages/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t(locale, 'admin.content.addPage')}
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={pages}
                    columns={columns}
                    searchable
                    onSearch={(s) => router.get('/admin/pages', { search: s })}
                />
            </div>
        </AdminLayout>
    );
}

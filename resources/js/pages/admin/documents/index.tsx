import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { getTranslation, t } from '@/lib/i18n';
import { type SharedData } from '@/types';

interface Props {
    documents: any;
    filters: any;
}

export default function AdminDocumentsIndex({ documents }: Props) {
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
            key: 'category',
            header: t(locale, 'common.category'),
            render: (row: any) => row.category?.name ?? '—',
        },
        {
            key: 'file_type',
            header: t(locale, 'common.fileType'),
            render: (row: any) => (
                <span className="text-xs font-medium text-muted-foreground uppercase">
                    {row.file_type ?? '—'}
                </span>
            ),
        },
        {
            key: 'download_count',
            header: t(locale, 'common.downloads'),
            render: (row: any) => row.download_count ?? 0,
        },
        {
            key: 'actions',
            header: t(locale, 'common.actions'),
            render: (row: any) => (
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/documents/${row.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (
                                confirm(
                                    t(locale, 'admin.content.deleteDocument'),
                                )
                            ) {
                                router.delete(`/admin/documents/${row.id}`);
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
                    title: t(locale, 'admin.content.documents'),
                    href: '/admin/documents',
                },
            ]}
        >
            <Head title={t(locale, 'admin.content.documents')} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {t(locale, 'admin.content.documents')}
                    </h1>
                    <Button asChild>
                        <Link href="/admin/documents/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t(locale, 'admin.content.uploadDocument')}
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={documents}
                    columns={columns}
                    searchable
                    onSearch={(s) =>
                        router.get('/admin/documents', { search: s })
                    }
                />
            </div>
        </AdminLayout>
    );
}

import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Props {
    documents: any;
    filters: any;
}

export default function AdminDocumentsIndex({ documents }: Props) {
    const columns = [
        {
            key: 'title',
            header: 'Title',
            render: (row: any) =>
                row.translations?.find((t: any) => t.language === 'en')?.title ?? 'Untitled',
        },
        {
            key: 'category',
            header: 'Category',
            render: (row: any) => row.category?.name ?? '—',
        },
        {
            key: 'file_type',
            header: 'File Type',
            render: (row: any) => (
                <span className="uppercase text-xs font-medium text-muted-foreground">
                    {row.file_type ?? '—'}
                </span>
            ),
        },
        {
            key: 'download_count',
            header: 'Downloads',
            render: (row: any) => row.download_count ?? 0,
        },
        {
            key: 'actions',
            header: 'Actions',
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
                            if (confirm('Delete this document?')) {
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
        <AdminLayout breadcrumbs={[{ title: 'Documents', href: '/admin/documents' }]}>
            <Head title="Documents" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Documents</h1>
                    <Button asChild>
                        <Link href="/admin/documents/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Document
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={documents}
                    columns={columns}
                    searchable
                    onSearch={(s) => router.get('/admin/documents', { search: s })}
                />
            </div>
        </AdminLayout>
    );
}

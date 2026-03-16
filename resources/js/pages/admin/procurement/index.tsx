import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Props {
    procurements: any;
    filters: any;
}

export default function AdminProcurementIndex({ procurements }: Props) {
    const columns = [
        {
            key: 'reference_number',
            header: 'Reference',
            render: (row: any) => (
                <span className="font-mono text-xs">{row.reference_number ?? '—'}</span>
            ),
        },
        {
            key: 'title',
            header: 'Title',
            render: (row: any) =>
                row.translations?.find((t: any) => t.language === 'en')?.title ?? 'Untitled',
        },
        {
            key: 'status',
            header: 'Status',
            render: (row: any) => <StatusBadge status={row.status} />,
        },
        {
            key: 'deadline',
            header: 'Deadline',
            render: (row: any) =>
                row.deadline ? new Date(row.deadline).toLocaleDateString() : '—',
        },
        {
            key: 'actions',
            header: 'Actions',
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
                            if (confirm('Delete this procurement?')) {
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
        <AdminLayout breadcrumbs={[{ title: 'Procurement', href: '/admin/procurement' }]}>
            <Head title="Procurement" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Procurement</h1>
                    <Button asChild>
                        <Link href="/admin/procurement/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Procurement
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={procurements}
                    columns={columns}
                    searchable
                    onSearch={(s) => router.get('/admin/procurement', { search: s })}
                />
            </div>
        </AdminLayout>
    );
}

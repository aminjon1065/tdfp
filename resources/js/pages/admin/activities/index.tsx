import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Props {
    activities: any;
    filters: any;
}

export default function AdminActivitiesIndex({ activities }: Props) {
    const columns = [
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
            key: 'start_date',
            header: 'Start Date',
            render: (row: any) =>
                row.start_date ? new Date(row.start_date).toLocaleDateString() : '—',
        },
        {
            key: 'end_date',
            header: 'End Date',
            render: (row: any) =>
                row.end_date ? new Date(row.end_date).toLocaleDateString() : '—',
        },
        {
            key: 'actions',
            header: 'Actions',
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
                            if (confirm('Delete this activity?')) {
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
        <AdminLayout breadcrumbs={[{ title: 'Activities', href: '/admin/activities' }]}>
            <Head title="Activities" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Activities</h1>
                    <Button asChild>
                        <Link href="/admin/activities/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Activity
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={activities}
                    columns={columns}
                    searchable
                    onSearch={(s) => router.get('/admin/activities', { search: s })}
                />
            </div>
        </AdminLayout>
    );
}

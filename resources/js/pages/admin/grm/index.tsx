import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';

interface Props {
    cases: any;
    filters: { status?: string };
}

const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'investigation', label: 'Investigation' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
];

export default function AdminGrmIndex({ cases, filters }: Props) {
    const columns = [
        {
            key: 'ticket_number',
            header: 'Ticket',
            render: (row: any) => (
                <span className="font-mono text-xs font-medium">{row.ticket_number}</span>
            ),
        },
        {
            key: 'complainant_name',
            header: 'Complainant',
            render: (row: any) => row.complainant_name ?? '—',
        },
        {
            key: 'category',
            header: 'Category',
            render: (row: any) => row.category ?? '—',
        },
        {
            key: 'status',
            header: 'Status',
            render: (row: any) => <StatusBadge status={row.status} />,
        },
        {
            key: 'created_at',
            header: 'Submitted',
            render: (row: any) =>
                row.created_at ? new Date(row.created_at).toLocaleDateString() : '—',
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row: any) => (
                <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/grm/${row.id}`}>
                        <Eye className="h-3.5 w-3.5" />
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <AdminLayout breadcrumbs={[{ title: 'GRM Cases', href: '/admin/grm' }]}>
            <Head title="GRM Cases" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">GRM Cases</h1>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filter by status:</span>
                    <div className="flex gap-1 flex-wrap">
                        {STATUS_OPTIONS.map((opt) => (
                            <Button
                                key={opt.value}
                                variant={filters.status === opt.value || (!filters.status && opt.value === '') ? 'default' : 'outline'}
                                size="sm"
                                onClick={() =>
                                    router.get('/admin/grm', opt.value ? { status: opt.value } : {})
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
                            ...(filters.status ? { status: filters.status } : {}),
                        })
                    }
                />
            </div>
        </AdminLayout>
    );
}

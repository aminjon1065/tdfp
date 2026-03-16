import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Head, router } from '@inertiajs/react';

interface Props {
    logs: any;
    filters: any;
}

const ACTION_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    created: 'default',
    updated: 'secondary',
    deleted: 'destructive',
    login: 'outline',
    logout: 'outline',
};

export default function AdminAuditLogsIndex({ logs }: Props) {
    const columns = [
        {
            key: 'user',
            header: 'User',
            render: (row: any) => (
                <span className="font-medium">{row.user?.name ?? 'System'}</span>
            ),
        },
        {
            key: 'action',
            header: 'Action',
            render: (row: any) => (
                <Badge variant={ACTION_COLORS[row.action] ?? 'secondary'}>
                    {row.action}
                </Badge>
            ),
        },
        {
            key: 'entity_type',
            header: 'Entity Type',
            render: (row: any) => (
                <span className="text-xs font-mono text-muted-foreground">
                    {row.entity_type ?? '—'}
                </span>
            ),
        },
        {
            key: 'entity_id',
            header: 'Entity ID',
            render: (row: any) => (
                <span className="text-xs font-mono">{row.entity_id ?? '—'}</span>
            ),
        },
        {
            key: 'ip_address',
            header: 'IP Address',
            render: (row: any) => (
                <span className="text-xs font-mono text-muted-foreground">
                    {row.ip_address ?? '—'}
                </span>
            ),
        },
        {
            key: 'created_at',
            header: 'Date',
            render: (row: any) =>
                row.created_at ? new Date(row.created_at).toLocaleString() : '—',
        },
    ];

    return (
        <AdminLayout breadcrumbs={[{ title: 'Audit Logs', href: '/admin/audit-logs' }]}>
            <Head title="Audit Logs" />
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Audit Logs</h1>
                <DataTable
                    data={logs}
                    columns={columns}
                    searchable
                    onSearch={(s) => router.get('/admin/audit-logs', { search: s })}
                />
            </div>
        </AdminLayout>
    );
}

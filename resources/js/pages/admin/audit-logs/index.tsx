import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t } from '@/lib/i18n';
import { Head, router, usePage } from '@inertiajs/react';
import { AuditLogEntry, Paginator, type SharedData } from '@/types';
import { useState } from 'react';

interface Props {
    logs: Paginator<AuditLogEntry>;
    filters: {
        search?: string | null;
        action?: string | null;
        entity_type?: string | null;
        user_id?: number | null;
        date_from?: string | null;
        date_to?: string | null;
    };
    actions: string[];
    entityTypes: string[];
    users: { id: number; name: string }[];
}

const ACTION_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    created: 'default',
    updated: 'secondary',
    deleted: 'destructive',
    login: 'outline',
    logout: 'outline',
};

export default function AdminAuditLogsIndex({ logs, filters, actions, entityTypes, users }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const [search, setSearch] = useState(filters.search ?? '');
    const columns = [
        {
            key: 'user',
            header: t(locale, 'common.user'),
            render: (row: AuditLogEntry) => (
                <span className="font-medium">{row.user?.name ?? t(locale, 'common.system')}</span>
            ),
        },
        {
            key: 'action',
            header: t(locale, 'common.action'),
            render: (row: AuditLogEntry) => (
                <Badge variant={ACTION_COLORS[row.action] ?? 'secondary'}>
                    {row.action}
                </Badge>
            ),
        },
        {
            key: 'entity_type',
            header: t(locale, 'common.entityType'),
            render: (row: AuditLogEntry) => (
                <span className="text-xs font-mono text-muted-foreground">
                    {row.entity_type ?? '—'}
                </span>
            ),
        },
        {
            key: 'entity_id',
            header: t(locale, 'common.entityId'),
            render: (row: AuditLogEntry) => (
                <span className="text-xs font-mono">{row.entity_id ?? '—'}</span>
            ),
        },
        {
            key: 'ip_address',
            header: t(locale, 'common.ipAddress'),
            render: (row: AuditLogEntry) => (
                <span className="text-xs font-mono text-muted-foreground">
                    {row.ip_address ?? '—'}
                </span>
            ),
        },
        {
            key: 'created_at',
            header: t(locale, 'common.date'),
            render: (row: AuditLogEntry) =>
                row.created_at ? new Date(row.created_at).toLocaleString() : '—',
        },
    ];

    const applyFilters = (nextFilters: Record<string, string | number | null | undefined>) => {
        router.get('/admin/audit-logs', {
            search: search || undefined,
            action: filters.action ?? undefined,
            entity_type: filters.entity_type ?? undefined,
            user_id: filters.user_id ?? undefined,
            date_from: filters.date_from ?? undefined,
            date_to: filters.date_to ?? undefined,
            ...nextFilters,
        });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: t(locale, 'admin.content.auditLogs'), href: '/admin/audit-logs' }]}>
            <Head title={t(locale, 'admin.content.auditLogs')} />
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">{t(locale, 'admin.content.auditLogs')}</h1>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            applyFilters({ search: search || undefined });
                        }}
                        className="flex gap-2 md:col-span-2 xl:col-span-1"
                    >
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t(locale, 'admin.content.searchAuditLogs')}
                        />
                        <Button type="submit" variant="outline">
                            {t(locale, 'common.search')}
                        </Button>
                    </form>

                    <select
                        value={filters.action ?? ''}
                        onChange={(event) => applyFilters({ action: event.target.value || undefined })}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">{t(locale, 'admin.content.allActions')}</option>
                        {actions.map((action) => (
                            <option key={action} value={action}>
                                {action}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.entity_type ?? ''}
                        onChange={(event) => applyFilters({ entity_type: event.target.value || undefined })}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">{t(locale, 'admin.content.allEntityTypes')}</option>
                        {entityTypes.map((entityType) => (
                            <option key={entityType} value={entityType}>
                                {entityType}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.user_id ?? ''}
                        onChange={(event) => applyFilters({ user_id: event.target.value ? Number(event.target.value) : undefined })}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">{t(locale, 'admin.content.allUsers')}</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>

                    <Input
                        type="date"
                        value={filters.date_from ?? ''}
                        onChange={(event) => applyFilters({ date_from: event.target.value || undefined })}
                    />

                    <Input
                        type="date"
                        value={filters.date_to ?? ''}
                        onChange={(event) => applyFilters({ date_to: event.target.value || undefined })}
                    />
                </div>

                <DataTable
                    data={logs}
                    columns={columns}
                />
            </div>
        </AdminLayout>
    );
}

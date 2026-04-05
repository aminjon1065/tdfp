import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { t } from '@/lib/i18n';
import { type SharedData } from '@/types';

interface Props {
    users: any;
    filters: any;
}

export default function AdminUsersIndex({ users }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    const columns = [
        {
            key: 'name',
            header: t(locale, 'common.name'),
            render: (row: any) => (
                <span className="font-medium">{row.name}</span>
            ),
        },
        {
            key: 'email',
            header: t(locale, 'common.email'),
            render: (row: any) => (
                <span className="text-muted-foreground">{row.email}</span>
            ),
        },
        {
            key: 'roles',
            header: t(locale, 'common.roles'),
            render: (row: any) => (
                <div className="flex flex-wrap gap-1">
                    {(row.roles ?? []).map((role: any) => (
                        <Badge key={role.id ?? role} variant="secondary">
                            {role.name ?? role}
                        </Badge>
                    ))}
                    {(row.roles ?? []).length === 0 && (
                        <span className="text-xs text-muted-foreground">—</span>
                    )}
                </div>
            ),
        },
        {
            key: 'is_active',
            header: t(locale, 'common.active'),
            render: (row: any) => (
                <Badge variant={row.is_active ? 'default' : 'secondary'}>
                    {row.is_active
                        ? t(locale, 'status.active')
                        : t(locale, 'status.inactive')}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: t(locale, 'common.actions'),
            render: (row: any) => (
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/users/${row.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (
                                confirm(t(locale, 'admin.content.deleteUser'))
                            ) {
                                router.delete(`/admin/users/${row.id}`);
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
                    title: t(locale, 'admin.content.users'),
                    href: '/admin/users',
                },
            ]}
        >
            <Head title={t(locale, 'admin.content.users')} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {t(locale, 'admin.content.users')}
                    </h1>
                    <Button asChild>
                        <Link href="/admin/users/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t(locale, 'admin.content.addUser')}
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={users}
                    columns={columns}
                    searchable
                    onSearch={(s) => router.get('/admin/users', { search: s })}
                />
            </div>
        </AdminLayout>
    );
}

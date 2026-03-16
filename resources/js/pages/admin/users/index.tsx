import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Props {
    users: any;
    filters: any;
}

export default function AdminUsersIndex({ users }: Props) {
    const columns = [
        {
            key: 'name',
            header: 'Name',
            render: (row: any) => <span className="font-medium">{row.name}</span>,
        },
        {
            key: 'email',
            header: 'Email',
            render: (row: any) => <span className="text-muted-foreground">{row.email}</span>,
        },
        {
            key: 'roles',
            header: 'Roles',
            render: (row: any) => (
                <div className="flex gap-1 flex-wrap">
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
            header: 'Active',
            render: (row: any) => (
                <Badge variant={row.is_active ? 'default' : 'secondary'}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
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
                            if (confirm('Delete this user?')) {
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
        <AdminLayout breadcrumbs={[{ title: 'Users', href: '/admin/users' }]}>
            <Head title="Users" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Button asChild>
                        <Link href="/admin/users/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
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

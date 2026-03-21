import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface StaffMemberRow {
    id: number;
    is_published: boolean;
    parent?: {
        translations?: Array<{
            language: string;
            full_name: string;
        }>;
    } | null;
    translations?: Array<{
        language: string;
        full_name: string;
        job_title: string;
    }>;
}

export default function AdminStaffMembersIndex({
    staffMembers,
}: {
    staffMembers: any;
}) {
    const columns = [
        {
            key: 'full_name',
            header: 'Name',
            render: (row: StaffMemberRow) => row.translations?.find((translation) => translation.language === 'en')?.full_name ?? 'Untitled',
        },
        {
            key: 'job_title',
            header: 'Job title',
            render: (row: StaffMemberRow) => row.translations?.find((translation) => translation.language === 'en')?.job_title ?? '—',
        },
        {
            key: 'reports_to',
            header: 'Reports to',
            render: (row: StaffMemberRow) => row.parent?.translations?.find((translation) => translation.language === 'en')?.full_name ?? 'Top level',
        },
        {
            key: 'status',
            header: 'Status',
            render: (row: StaffMemberRow) => (
                <span className={row.is_published ? 'text-emerald-700' : 'text-slate-500'}>
                    {row.is_published ? 'Published' : 'Draft'}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row: StaffMemberRow) => (
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/staff-members/${row.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (confirm('Delete this staff record?')) {
                                router.delete(`/admin/staff-members/${row.id}`);
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
        <AdminLayout breadcrumbs={[{ title: 'Staff Directory', href: '/admin/staff-members' }]}>
            <Head title="Staff Directory" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Staff Directory</h1>
                        <p className="text-sm text-muted-foreground">
                            Maintain the public leadership and reporting structure.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/staff-members/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add staff member
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={staffMembers}
                    columns={columns}
                    searchable
                    onSearch={(search) => router.get('/admin/staff-members', { search })}
                />
            </div>
        </AdminLayout>
    );
}

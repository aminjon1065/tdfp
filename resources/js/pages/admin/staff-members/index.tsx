import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { getTranslation, t } from '@/lib/i18n';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { type SharedData } from '@/types';

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
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    const columns = [
        {
            key: 'full_name',
            header: t(locale, 'common.name'),
            render: (row: StaffMemberRow) => getTranslation(row, locale).full_name ?? t(locale, 'admin.content.untitled'),
        },
        {
            key: 'job_title',
            header: t(locale, 'admin.form.jobTitle'),
            render: (row: StaffMemberRow) => getTranslation(row, locale).job_title ?? '—',
        },
        {
            key: 'reports_to',
            header: t(locale, 'admin.form.reportsTo'),
            render: (row: StaffMemberRow) => getTranslation(row.parent, locale).full_name ?? t(locale, 'admin.form.topLevel'),
        },
        {
            key: 'status',
            header: t(locale, 'common.status'),
            render: (row: StaffMemberRow) => (
                <span className={row.is_published ? 'text-emerald-700' : 'text-slate-500'}>
                    {row.is_published ? t(locale, 'status.published') : t(locale, 'status.draft')}
                </span>
            ),
        },
        {
            key: 'actions',
            header: t(locale, 'common.actions'),
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
                            if (confirm(t(locale, 'admin.form.deleteStaffRecord'))) {
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
        <AdminLayout breadcrumbs={[{ title: t(locale, 'admin.nav.staff'), href: '/admin/staff-members' }]}>
            <Head title={t(locale, 'admin.nav.staff')} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{t(locale, 'admin.nav.staff')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t(locale, 'admin.form.staffDirectoryHint')}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/staff-members/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t(locale, 'admin.form.addStaffMember')}
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

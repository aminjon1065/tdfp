import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';

import StaffMemberForm from './form';

export default function AdminStaffMembersCreate({
    parentOptions,
}: {
    parentOptions: any[];
}) {
    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Staff Directory', href: '/admin/staff-members' },
                { title: 'Create', href: '/admin/staff-members/create' },
            ]}
        >
            <Head title="Create Staff Member" />
            <div className="max-w-4xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Add Staff Member</h1>
                    <p className="text-sm text-muted-foreground">
                        Create a public profile and place it in the reporting hierarchy.
                    </p>
                </div>

                <StaffMemberForm
                    action="/admin/staff-members"
                    method="post"
                    parentOptions={parentOptions}
                    submitLabel="Create staff member"
                />
            </div>
        </AdminLayout>
    );
}

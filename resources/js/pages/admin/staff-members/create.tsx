import { Head, usePage } from '@inertiajs/react';

import AdminLayout from '@/layouts/admin-layout';
import { t } from '@/lib/i18n';
import { type SharedData } from '@/types';

import StaffMemberForm from './form';

export default function AdminStaffMembersCreate({
    parentOptions,
}: {
    parentOptions: any[];
}) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    return (
        <AdminLayout
            breadcrumbs={[
                {
                    title: t(locale, 'admin.nav.staff'),
                    href: '/admin/staff-members',
                },
                {
                    title: t(locale, 'admin.form.create'),
                    href: '/admin/staff-members/create',
                },
            ]}
        >
            <Head
                title={`${t(locale, 'admin.form.create')} ${t(locale, 'admin.nav.staff')}`}
            />
            <div className="max-w-4xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        {t(locale, 'admin.form.create')}{' '}
                        {t(locale, 'admin.nav.staff')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(locale, 'admin.form.staffCreateHint')}
                    </p>
                </div>

                <StaffMemberForm
                    action="/admin/staff-members"
                    method="post"
                    parentOptions={parentOptions}
                    submitLabel={`${t(locale, 'common.create')} ${t(locale, 'admin.nav.staff')}`}
                />
            </div>
        </AdminLayout>
    );
}

import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';

import StaffMemberForm from './form';

export default function AdminStaffMembersEdit({
    staffMember,
    parentOptions,
}: {
    staffMember: any;
    parentOptions: any[];
}) {
    const translations = Object.fromEntries(
        staffMember.translations.map((translation: any) => [
            translation.language,
            {
                full_name: translation.full_name ?? '',
                job_title: translation.job_title ?? '',
                department: translation.department ?? '',
                biography: translation.biography ?? '',
            },
        ]),
    );

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Staff Directory', href: '/admin/staff-members' },
                { title: 'Edit', href: `/admin/staff-members/${staffMember.id}/edit` },
            ]}
        >
            <Head title="Edit Staff Member" />
            <div className="max-w-4xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Edit Staff Member</h1>
                    <p className="text-sm text-muted-foreground">
                        Update hierarchy, translations, and publication state.
                    </p>
                </div>

                <StaffMemberForm
                    action={`/admin/staff-members/${staffMember.id}`}
                    method="put"
                    parentOptions={parentOptions}
                    submitLabel="Save changes"
                    staffMember={{
                        id: staffMember.id,
                        parent_id: staffMember.parent_id,
                        email: staffMember.email ?? '',
                        phone: staffMember.phone ?? '',
                        photo_path: staffMember.photo_path ?? null,
                        is_leadership: staffMember.is_leadership,
                        is_published: staffMember.is_published,
                        sort_order: staffMember.sort_order,
                        translations: {
                            en: translations.en ?? { full_name: '', job_title: '', department: '', biography: '' },
                            ru: translations.ru ?? { full_name: '', job_title: '', department: '', biography: '' },
                            tj: translations.tj ?? { full_name: '', job_title: '', department: '', biography: '' },
                        },
                    }}
                />
            </div>
        </AdminLayout>
    );
}

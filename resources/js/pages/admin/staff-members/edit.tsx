import { Head, usePage } from '@inertiajs/react';

import AdminLayout from '@/layouts/admin-layout';
import { t } from '@/lib/i18n';
import { type SharedData } from '@/types';

import StaffMemberForm from './form';

export default function AdminStaffMembersEdit({
    staffMember,
    parentOptions,
}: {
    staffMember: any;
    parentOptions: any[];
}) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

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
                {
                    title: t(locale, 'admin.nav.staff'),
                    href: '/admin/staff-members',
                },
                {
                    title: t(locale, 'admin.form.edit'),
                    href: `/admin/staff-members/${staffMember.id}/edit`,
                },
            ]}
        >
            <Head
                title={`${t(locale, 'admin.form.edit')} ${t(locale, 'admin.nav.staff')}`}
            />
            <div className="max-w-4xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        {t(locale, 'admin.form.edit')}{' '}
                        {t(locale, 'admin.nav.staff')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(locale, 'admin.form.staffEditHint')}
                    </p>
                </div>

                <StaffMemberForm
                    action={`/admin/staff-members/${staffMember.id}`}
                    method="put"
                    parentOptions={parentOptions}
                    submitLabel={t(locale, 'common.save')}
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
                            en: translations.en ?? {
                                full_name: '',
                                job_title: '',
                                department: '',
                                biography: '',
                            },
                            ru: translations.ru ?? {
                                full_name: '',
                                job_title: '',
                                department: '',
                                biography: '',
                            },
                            tj: translations.tj ?? {
                                full_name: '',
                                job_title: '',
                                department: '',
                                biography: '',
                            },
                        },
                    }}
                />
            </div>
        </AdminLayout>
    );
}

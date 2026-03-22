import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { t } from '@/lib/i18n';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Props {
    roles: { id: number; name: string }[];
}

export default function AdminUsersCreate({ roles }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: t(locale, 'admin.content.users'), href: '/admin/users' },
                { title: t(locale, 'admin.form.create'), href: '/admin/users/create' },
            ]}
        >
            <Head title={`${t(locale, 'admin.form.create')} ${t(locale, 'admin.content.users')}`} />
            <div className="max-w-xl space-y-6">
                <h1 className="text-2xl font-bold">{t(locale, 'admin.content.addUser')}</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t(locale, 'common.name')}</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoComplete="name"
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t(locale, 'common.email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="email"
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">{t(locale, 'admin.form.password')}</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">{t(locale, 'admin.form.confirmPassword')}</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                        />
                        {errors.password_confirmation && (
                            <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">{t(locale, 'admin.form.role')}</Label>
                        <select
                            id="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">— {t(locale, 'admin.form.noRole')} —</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.name}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                        {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="h-4 w-4 rounded border-input"
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                            {t(locale, 'status.active')}
                        </Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? t(locale, 'admin.form.currentlyCreating') : t(locale, 'admin.content.addUser')}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            {t(locale, 'common.cancel')}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

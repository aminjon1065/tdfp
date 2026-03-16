import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    user: any;
    roles: { id: number; name: string }[];
}

export default function AdminUsersEdit({ user, roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: user.name ?? '',
        email: user.email ?? '',
        password: '',
        password_confirmation: '',
        role: user.roles?.[0]?.name ?? '',
        is_active: user.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Users', href: '/admin/users' },
                { title: 'Edit', href: `/admin/users/${user.id}/edit` },
            ]}
        >
            <Head title="Edit User" />
            <div className="max-w-xl space-y-6">
                <h1 className="text-2xl font-bold">Edit User</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">
                            New Password{' '}
                            <span className="text-xs text-muted-foreground">(leave blank to keep current)</span>
                        </Label>
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
                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">— No Role —</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.name}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
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
                            Active
                        </Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : 'Update User'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

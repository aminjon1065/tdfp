import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Head, useForm } from '@inertiajs/react';

interface Setting {
    id: number;
    key: string;
    value: string;
    type: 'text' | 'textarea' | 'boolean' | 'number';
    label: string;
    group: string;
}

interface Props {
    settings: Setting[];
}

export default function AdminSettingsIndex({ settings }: Props) {
    // Build initial values map from settings
    const initialValues = settings.reduce<Record<string, string>>((acc, s) => {
        acc[s.key] = s.value ?? '';
        return acc;
    }, {});

    const { data, setData, post, processing, errors } = useForm<Record<string, string>>(initialValues);

    // Group settings by their group key
    const groups = settings.reduce<Record<string, Setting[]>>((acc, s) => {
        const g = s.group ?? 'General';
        if (!acc[g]) acc[g] = [];
        acc[g].push(s);
        return acc;
    }, {});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings');
    };

    const groupLabel = (key: string) =>
        key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <AdminLayout breadcrumbs={[{ title: 'Settings', href: '/admin/settings' }]}>
            <Head title="Settings" />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.entries(groups).map(([group, items]) => (
                        <Card key={group}>
                            <CardHeader>
                                <CardTitle className="text-base">{groupLabel(group)}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {items.map((setting, idx) => (
                                    <div key={setting.key}>
                                        {idx > 0 && <Separator className="mb-4" />}
                                        <div className="space-y-2">
                                            <Label htmlFor={setting.key}>{setting.label}</Label>
                                            {setting.type === 'textarea' ? (
                                                <textarea
                                                    id={setting.key}
                                                    value={data[setting.key] ?? ''}
                                                    onChange={(e) =>
                                                        setData(setting.key, e.target.value)
                                                    }
                                                    rows={4}
                                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                />
                                            ) : setting.type === 'boolean' ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        id={setting.key}
                                                        type="checkbox"
                                                        checked={data[setting.key] === '1' || data[setting.key] === 'true'}
                                                        onChange={(e) =>
                                                            setData(setting.key, e.target.checked ? '1' : '0')
                                                        }
                                                        className="h-4 w-4 rounded border-input"
                                                    />
                                                    <span className="text-sm text-muted-foreground">
                                                        Enabled
                                                    </span>
                                                </div>
                                            ) : (
                                                <Input
                                                    id={setting.key}
                                                    type={setting.type === 'number' ? 'number' : 'text'}
                                                    value={data[setting.key] ?? ''}
                                                    onChange={(e) =>
                                                        setData(setting.key, e.target.value)
                                                    }
                                                />
                                            )}
                                            {errors[setting.key] && (
                                                <p className="text-sm text-destructive">
                                                    {errors[setting.key]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                    {settings.length === 0 && (
                        <p className="text-sm text-muted-foreground">No settings configured.</p>
                    )}

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving…' : 'Save Settings'}
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}

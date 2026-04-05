import { Head, useForm, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { t } from '@/lib/i18n';
import { type SharedData } from '@/types';

interface Setting {
    id: number;
    key: string;
    value: string;
    type: 'text' | 'textarea' | 'boolean' | 'number' | 'email' | 'url';
    label: string;
    group: string;
}

interface Props {
    settings: Setting[];
}

export default function AdminSettingsIndex({ settings }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    const initialValues = settings.reduce<Record<string, string>>((acc, s) => {
        acc[s.key] = s.value ?? '';
        return acc;
    }, {});

    const { data, setData, post, processing, errors } = useForm<{
        settings: Record<string, string>;
    }>({
        settings: initialValues,
    });

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
        <AdminLayout
            breadcrumbs={[
                {
                    title: t(locale, 'admin.content.settings'),
                    href: '/admin/settings',
                },
            ]}
        >
            <Head title={t(locale, 'admin.content.settings')} />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">
                    {t(locale, 'admin.content.settings')}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.entries(groups).map(([group, items]) => (
                        <Card key={group}>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {groupLabel(group)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {items.map((setting, idx) => (
                                    <div key={setting.key}>
                                        {idx > 0 && (
                                            <Separator className="mb-4" />
                                        )}
                                        <div className="space-y-2">
                                            <Label htmlFor={setting.key}>
                                                {setting.label}
                                            </Label>
                                            {setting.type === 'textarea' ? (
                                                <textarea
                                                    id={setting.key}
                                                    value={
                                                        data.settings[
                                                            setting.key
                                                        ] ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        setData('settings', {
                                                            ...data.settings,
                                                            [setting.key]:
                                                                e.target.value,
                                                        })
                                                    }
                                                    rows={4}
                                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                                />
                                            ) : setting.type === 'boolean' ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        id={setting.key}
                                                        type="checkbox"
                                                        checked={
                                                            data.settings[
                                                                setting.key
                                                            ] === '1' ||
                                                            data.settings[
                                                                setting.key
                                                            ] === 'true'
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'settings',
                                                                {
                                                                    ...data.settings,
                                                                    [setting.key]:
                                                                        e.target
                                                                            .checked
                                                                            ? '1'
                                                                            : '0',
                                                                },
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-input"
                                                    />
                                                    <span className="text-sm text-muted-foreground">
                                                        {t(
                                                            locale,
                                                            'common.enabled',
                                                        )}
                                                    </span>
                                                </div>
                                            ) : (
                                                <Input
                                                    id={setting.key}
                                                    type={setting.type}
                                                    value={
                                                        data.settings[
                                                            setting.key
                                                        ] ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        setData('settings', {
                                                            ...data.settings,
                                                            [setting.key]:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            )}
                                            {errors[
                                                `settings.${setting.key}`
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            `settings.${setting.key}`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                    {settings.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            {t(locale, 'admin.content.noSettings')}
                        </p>
                    )}

                    <Button type="submit" disabled={processing}>
                        {processing
                            ? t(locale, 'admin.content.saving')
                            : t(locale, 'admin.content.saveSettings')}
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}

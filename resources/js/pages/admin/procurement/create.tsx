import { Head, useForm, usePage } from '@inertiajs/react';

import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { t } from '@/lib/i18n';
import { type SharedData } from '@/types';

export default function AdminProcurementCreate() {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const { data, setData, post, processing, errors } = useForm<{
        reference_number: string;
        status: string;
        publication_date: string;
        deadline: string;
        translations: Record<string, { title: string; description: string }>;
    }>({
        reference_number: '',
        status: 'open',
        publication_date: '',
        deadline: '',
        translations: {
            en: { title: '', description: '' },
            ru: { title: '', description: '' },
            tj: { title: '', description: '' },
        },
    });

    const handleTranslationChange = (
        lang: string,
        field: string,
        value: string,
    ) => {
        setData('translations', {
            ...data.translations,
            [lang]: { ...data.translations[lang], [field]: value },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/procurement');
    };

    return (
        <AdminLayout
            breadcrumbs={[
                {
                    title: t(locale, 'admin.content.procurement'),
                    href: '/admin/procurement',
                },
                {
                    title: t(locale, 'admin.form.create'),
                    href: '/admin/procurement/create',
                },
            ]}
        >
            <Head
                title={`${t(locale, 'admin.form.create')} ${t(locale, 'admin.content.procurement')}`}
            />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">
                    {t(locale, 'admin.content.addProcurement')}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="reference_number">
                                {t(locale, 'admin.form.referenceNumber')}
                            </Label>
                            <Input
                                id="reference_number"
                                value={data.reference_number}
                                onChange={(e) =>
                                    setData('reference_number', e.target.value)
                                }
                                placeholder="e.g. TDFP-2025-001"
                            />
                            {errors.reference_number && (
                                <p className="text-sm text-destructive">
                                    {errors.reference_number}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">
                                {t(locale, 'admin.form.status')}
                            </Label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="open">
                                    {t(locale, 'status.open')}
                                </option>
                                <option value="closed">
                                    {t(locale, 'status.closed')}
                                </option>
                                <option value="awarded">
                                    {t(locale, 'status.awarded')}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="publication_date">
                                {t(locale, 'admin.form.publicationDate')}
                            </Label>
                            <Input
                                id="publication_date"
                                type="date"
                                value={data.publication_date}
                                onChange={(e) =>
                                    setData('publication_date', e.target.value)
                                }
                            />
                            {errors.publication_date && (
                                <p className="text-sm text-destructive">
                                    {errors.publication_date}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline">
                                {t(locale, 'admin.content.deadline')}
                            </Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={data.deadline}
                                onChange={(e) =>
                                    setData('deadline', e.target.value)
                                }
                            />
                            {errors.deadline && (
                                <p className="text-sm text-destructive">
                                    {errors.deadline}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t(locale, 'common.translations')}</Label>
                        <TranslationTabs
                            fields={[
                                {
                                    name: 'title',
                                    label: t(locale, 'common.title'),
                                    type: 'input',
                                    required: true,
                                },
                                {
                                    name: 'description',
                                    label: t(locale, 'common.descriptionLabel'),
                                    type: 'textarea',
                                },
                            ]}
                            data={data.translations}
                            onChange={handleTranslationChange}
                            errors={errors}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? t(locale, 'admin.content.saving')
                                : t(locale, 'admin.content.addProcurement')}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => history.back()}
                        >
                            {t(locale, 'common.cancel')}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

import AdminLayout from '@/layouts/admin-layout';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { t } from '@/lib/i18n';
import { Head, useForm, usePage } from '@inertiajs/react';
import { SupportedLocale, type SharedData } from '@/types';

interface Props {
    procurement: any;
}

export default function AdminProcurementEdit({ procurement }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const translationsMap =
        procurement.translations?.reduce((acc: any, t: any) => {
            acc[t.language] = {
                title: t.title ?? '',
                description: t.description ?? '',
            };
            return acc;
        }, {}) ?? {};

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        reference_number: procurement.reference_number ?? '',
        status: procurement.status ?? 'open',
        publication_date: procurement.publication_date ?? '',
        deadline: procurement.deadline ?? '',
        translations: {
            en: translationsMap['en'] ?? { title: '', description: '' },
            ru: translationsMap['ru'] ?? { title: '', description: '' },
            tj: translationsMap['tj'] ?? { title: '', description: '' },
        },
    });

    const handleTranslationChange = (lang: SupportedLocale, field: string, value: string) => {
        setData('translations', {
            ...data.translations,
            [lang]: { ...data.translations[lang], [field]: value },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/procurement/${procurement.id}`);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: t(locale, 'admin.content.procurement'), href: '/admin/procurement' },
                { title: t(locale, 'admin.form.edit'), href: `/admin/procurement/${procurement.id}/edit` },
            ]}
        >
            <Head title={`${t(locale, 'admin.form.edit')} ${t(locale, 'admin.content.procurement')}`} />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">{t(locale, 'admin.form.edit')} {t(locale, 'admin.content.procurement')}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>{t(locale, 'admin.form.referenceNumber')}</Label>
                            <Input
                                value={data.reference_number}
                                onChange={(e) => setData('reference_number', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t(locale, 'admin.form.status')}</Label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="open">{t(locale, 'status.open')}</option>
                                <option value="closed">{t(locale, 'status.closed')}</option>
                                <option value="awarded">{t(locale, 'status.awarded')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>{t(locale, 'admin.form.publicationDate')}</Label>
                            <Input
                                type="date"
                                value={data.publication_date}
                                onChange={(e) => setData('publication_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t(locale, 'admin.content.deadline')}</Label>
                            <Input
                                type="date"
                                value={data.deadline}
                                onChange={(e) => setData('deadline', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t(locale, 'common.translations')}</Label>
                        <TranslationTabs
                            fields={[
                                { name: 'title', label: t(locale, 'common.title'), type: 'input', required: true },
                                { name: 'description', label: t(locale, 'common.descriptionLabel'), type: 'textarea' },
                            ]}
                            data={data.translations}
                            onChange={handleTranslationChange}
                            errors={errors}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? t(locale, 'admin.content.saving') : `${t(locale, 'common.update')} ${t(locale, 'admin.content.procurement')}`}
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

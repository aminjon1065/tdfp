import AdminLayout from '@/layouts/admin-layout';
import { EditorialPreviewButton } from '@/components/admin/editorial-preview-button';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { t } from '@/lib/i18n';
import { Head, useForm, usePage } from '@inertiajs/react';
import { SupportedLocale, type SharedData } from '@/types';

interface Props {
    page: any;
}

export default function AdminPagesEdit({ page }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const translationsMap =
        page.translations?.reduce((acc: any, t: any) => {
            acc[t.language] = {
                title: t.title ?? '',
                content: t.content ?? '',
                meta_title: t.meta_title ?? '',
                meta_description: t.meta_description ?? '',
            };
            return acc;
        }, {}) ?? {};

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        status: page.status ?? 'draft',
        translations: {
            en: translationsMap['en'] ?? {
                title: '',
                content: '',
                meta_title: '',
                meta_description: '',
            },
            ru: translationsMap['ru'] ?? {
                title: '',
                content: '',
                meta_title: '',
                meta_description: '',
            },
            tj: translationsMap['tj'] ?? {
                title: '',
                content: '',
                meta_title: '',
                meta_description: '',
            },
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
        post(`/admin/pages/${page.id}`);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: t(locale, 'admin.content.pages'), href: '/admin/pages' },
                { title: t(locale, 'admin.form.edit'), href: `/admin/pages/${page.id}/edit` },
            ]}
        >
            <Head title={`${t(locale, 'admin.form.edit')} ${t(locale, 'admin.content.pages')}`} />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">{t(locale, 'admin.form.edit')} {t(locale, 'admin.content.pages').slice(0, -1)}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>{t(locale, 'admin.form.status')}</Label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="draft">{t(locale, 'status.draft')}</option>
                            <option value="published">{t(locale, 'status.published')}</option>
                            <option value="archived">{t(locale, 'status.archived')}</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>{t(locale, 'common.translations')}</Label>
                        <TranslationTabs
                            fields={[
                                { name: 'title', label: t(locale, 'common.title'), type: 'input', required: true },
                                { name: 'content', label: t(locale, 'common.content'), type: 'richtext' },
                                { name: 'meta_title', label: t(locale, 'common.metaTitle'), type: 'input' },
                                {
                                    name: 'meta_description',
                                    label: t(locale, 'common.metaDescription'),
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
                            {processing ? t(locale, 'admin.content.saving') : `${t(locale, 'common.update')} ${t(locale, 'admin.content.pages').slice(0, -1)}`}
                        </Button>
                        <EditorialPreviewButton
                            endpoint="/admin/editorial-preview/pages"
                            payload={data}
                            disabled={processing}
                        />
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            {t(locale, 'common.cancel')}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

import { Head, useForm, usePage } from '@inertiajs/react';

import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { t } from '@/lib/i18n';
import { SupportedLocale, type SharedData } from '@/types';

interface Props {
    document: any;
    categories: { id: number; name: string }[];
}

export default function AdminDocumentsEdit({ document, categories }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const translationsMap =
        document.translations?.reduce((acc: any, t: any) => {
            acc[t.language] = {
                title: t.title ?? '',
                description: t.description ?? '',
            };
            return acc;
        }, {}) ?? {};

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        category_id: String(document.category_id ?? ''),
        file: null as File | null,
        translations: {
            en: translationsMap['en'] ?? { title: '', description: '' },
            ru: translationsMap['ru'] ?? { title: '', description: '' },
            tj: translationsMap['tj'] ?? { title: '', description: '' },
        },
    });

    const handleTranslationChange = (
        lang: SupportedLocale,
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
        post(`/admin/documents/${document.id}`);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                {
                    title: t(locale, 'admin.content.documents'),
                    href: '/admin/documents',
                },
                {
                    title: t(locale, 'admin.form.edit'),
                    href: `/admin/documents/${document.id}/edit`,
                },
            ]}
        >
            <Head
                title={`${t(locale, 'admin.form.edit')} ${t(locale, 'admin.content.documents')}`}
            />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">
                    {t(locale, 'admin.form.edit')}{' '}
                    {t(locale, 'admin.content.documents')}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>{t(locale, 'admin.form.category')}</Label>
                        <select
                            value={data.category_id}
                            onChange={(e) =>
                                setData('category_id', e.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">
                                — {t(locale, 'admin.form.noCategory')} —
                            </option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            {t(locale, 'admin.form.replaceFileOptional')}
                        </Label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setData('file', e.target.files?.[0] ?? null)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                        />
                        {document.file_name && (
                            <p className="text-xs text-muted-foreground">
                                {t(locale, 'admin.form.currentFile')}:{' '}
                                {document.file_name}
                            </p>
                        )}
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
                                : `${t(locale, 'common.update')} ${t(locale, 'admin.content.documents')}`}
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

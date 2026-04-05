import { Head, useForm, usePage } from '@inertiajs/react';

import { EditorialPreviewButton } from '@/components/admin/editorial-preview-button';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { t } from '@/lib/i18n';
import { type SharedData } from '@/types';

interface Props {
    categories: { id: number; name: string }[];
}

export default function AdminNewsCreate({ categories }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const { data, setData, post, processing, errors } = useForm<{
        category_id: string;
        status: string;
        is_featured: boolean;
        featured_image: File | null;
        translations: Record<
            string,
            { title: string; summary: string; content: string }
        >;
    }>({
        category_id: '',
        status: 'draft',
        is_featured: false,
        featured_image: null,
        translations: {
            en: { title: '', summary: '', content: '' },
            ru: { title: '', summary: '', content: '' },
            tj: { title: '', summary: '', content: '' },
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
        post('/admin/news');
    };

    const previewPayload = new FormData();

    previewPayload.append('status', data.status);
    previewPayload.append('is_featured', data.is_featured ? '1' : '0');

    if (data.category_id !== '') {
        previewPayload.append('category_id', data.category_id);
    }

    Object.entries(data.translations).forEach(([language, translation]) => {
        previewPayload.append(
            `translations[${language}][title]`,
            translation.title,
        );
        previewPayload.append(
            `translations[${language}][summary]`,
            translation.summary,
        );
        previewPayload.append(
            `translations[${language}][content]`,
            translation.content,
        );
    });

    return (
        <AdminLayout
            breadcrumbs={[
                { title: t(locale, 'admin.content.news'), href: '/admin/news' },
                {
                    title: t(locale, 'admin.form.create'),
                    href: '/admin/news/create',
                },
            ]}
        >
            <Head
                title={`${t(locale, 'admin.form.create')} ${t(locale, 'admin.content.news')}`}
            />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">
                    {t(locale, 'admin.content.addArticle')}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="category">
                                {t(locale, 'admin.form.category')}
                            </Label>
                            <select
                                id="category"
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
                                <option value="draft">
                                    {t(locale, 'status.draft')}
                                </option>
                                <option value="published">
                                    {t(locale, 'status.published')}
                                </option>
                                <option value="archived">
                                    {t(locale, 'status.archived')}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="featured_image">
                            {t(locale, 'admin.form.featuredImage')}
                        </Label>
                        <input
                            id="featured_image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData(
                                    'featured_image',
                                    e.target.files?.[0] ?? null,
                                )
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                        />
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
                                    name: 'summary',
                                    label: t(locale, 'common.summary'),
                                    type: 'textarea',
                                },
                                {
                                    name: 'content',
                                    label: t(locale, 'common.content'),
                                    type: 'richtext',
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
                                : t(locale, 'admin.content.addArticle')}
                        </Button>
                        <EditorialPreviewButton
                            endpoint="/admin/editorial-preview/news"
                            payload={previewPayload}
                            disabled={processing}
                        />
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

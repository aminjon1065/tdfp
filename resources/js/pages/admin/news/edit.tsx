import { Head, useForm, usePage } from '@inertiajs/react';

import { EditorialPreviewButton } from '@/components/admin/editorial-preview-button';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { t } from '@/lib/i18n';
import { SupportedLocale, type SharedData } from '@/types';

interface Props {
    news: any;
    categories: { id: number; name: string }[];
}

export default function AdminNewsEdit({ news, categories }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const translationsMap =
        news.translations?.reduce((acc: any, t: any) => {
            acc[t.language] = {
                title: t.title ?? '',
                summary: t.summary ?? '',
                content: t.content ?? '',
            };
            return acc;
        }, {}) ?? {};

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        category_id: String(news.category_id ?? ''),
        status: news.status ?? 'draft',
        is_featured: news.is_featured ?? false,
        featured_image: null as File | null,
        translations: {
            en: translationsMap['en'] ?? {
                title: '',
                summary: '',
                content: '',
            },
            ru: translationsMap['ru'] ?? {
                title: '',
                summary: '',
                content: '',
            },
            tj: translationsMap['tj'] ?? {
                title: '',
                summary: '',
                content: '',
            },
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
        post(`/admin/news/${news.id}`);
    };

    const previewPayload = new FormData();

    previewPayload.append('status', data.status);
    previewPayload.append('is_featured', data.is_featured ? '1' : '0');

    if (data.category_id !== '') {
        previewPayload.append('category_id', data.category_id);
    }

    if (news.featured_image_url) {
        previewPayload.append('featured_image_url', news.featured_image_url);
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
                    title: t(locale, 'admin.form.edit'),
                    href: `/admin/news/${news.id}/edit`,
                },
            ]}
        >
            <Head
                title={`${t(locale, 'admin.form.edit')} ${t(locale, 'admin.content.news')}`}
            />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">
                    {t(locale, 'admin.form.edit')}{' '}
                    {t(locale, 'admin.content.news').slice(0, -1)}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
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
                            <Label>{t(locale, 'admin.form.status')}</Label>
                            <select
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
                        <Label>{t(locale, 'admin.form.featuredImage')}</Label>
                        <input
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
                        {news.featured_image_url && (
                            <img
                                src={news.featured_image_url}
                                alt={t(
                                    locale,
                                    'admin.form.currentFeaturedImage',
                                )}
                                className="h-24 w-auto rounded-md object-cover"
                            />
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
                                : `${t(locale, 'common.update')} ${t(locale, 'admin.content.news').slice(0, -1)}`}
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

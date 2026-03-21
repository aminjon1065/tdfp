import AdminLayout from '@/layouts/admin-layout';
import { EditorialPreviewButton } from '@/components/admin/editorial-preview-button';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { SupportedLocale } from '@/types';

interface Props {
    news: any;
    categories: { id: number; name: string }[];
}

export default function AdminNewsEdit({ news, categories }: Props) {
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
            en: translationsMap['en'] ?? { title: '', summary: '', content: '' },
            ru: translationsMap['ru'] ?? { title: '', summary: '', content: '' },
            tj: translationsMap['tj'] ?? { title: '', summary: '', content: '' },
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
        previewPayload.append(`translations[${language}][title]`, translation.title);
        previewPayload.append(`translations[${language}][summary]`, translation.summary);
        previewPayload.append(`translations[${language}][content]`, translation.content);
    });

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'News', href: '/admin/news' },
                { title: 'Edit', href: `/admin/news/${news.id}/edit` },
            ]}
        >
            <Head title="Edit News Article" />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">Edit News Article</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="">— No Category —</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Featured Image</Label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('featured_image', e.target.files?.[0] ?? null)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                        />
                        {news.featured_image_url && (
                            <img
                                src={news.featured_image_url}
                                alt="Current featured image"
                                className="h-24 w-auto rounded-md object-cover"
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Translations</Label>
                        <TranslationTabs
                            fields={[
                                { name: 'title', label: 'Title', type: 'input', required: true },
                                { name: 'summary', label: 'Summary', type: 'textarea' },
                                { name: 'content', label: 'Content', type: 'richtext' },
                            ]}
                            data={data.translations}
                            onChange={handleTranslationChange}
                            errors={errors}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : 'Update Article'}
                        </Button>
                        <EditorialPreviewButton
                            endpoint="/admin/editorial-preview/news"
                            payload={previewPayload}
                            disabled={processing}
                        />
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

import AdminLayout from '@/layouts/admin-layout';
import { EditorialPreviewButton } from '@/components/admin/editorial-preview-button';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    categories: { id: number; name: string }[];
}

export default function AdminNewsCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        category_id: string;
        status: string;
        is_featured: boolean;
        featured_image: File | null;
        translations: Record<string, { title: string; summary: string; content: string }>;
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

    const handleTranslationChange = (lang: string, field: string, value: string) => {
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
        previewPayload.append(`translations[${language}][title]`, translation.title);
        previewPayload.append(`translations[${language}][summary]`, translation.summary);
        previewPayload.append(`translations[${language}][content]`, translation.content);
    });

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'News', href: '/admin/news' },
                { title: 'Create', href: '/admin/news/create' },
            ]}
        >
            <Head title="Create News Article" />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">Create News Article</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
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
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
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
                        <Label htmlFor="featured_image">Featured Image</Label>
                        <input
                            id="featured_image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('featured_image', e.target.files?.[0] ?? null)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                        />
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
                            {processing ? 'Saving…' : 'Create Article'}
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

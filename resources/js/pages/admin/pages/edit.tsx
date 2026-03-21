import AdminLayout from '@/layouts/admin-layout';
import { EditorialPreviewButton } from '@/components/admin/editorial-preview-button';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { SupportedLocale } from '@/types';

interface Props {
    page: any;
}

export default function AdminPagesEdit({ page }: Props) {
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
                { title: 'Pages', href: '/admin/pages' },
                { title: 'Edit', href: `/admin/pages/${page.id}/edit` },
            ]}
        >
            <Head title="Edit Page" />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">Edit Page</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div className="space-y-2">
                        <Label>Translations</Label>
                        <TranslationTabs
                            fields={[
                                { name: 'title', label: 'Title', type: 'input', required: true },
                                { name: 'content', label: 'Content', type: 'richtext' },
                                { name: 'meta_title', label: 'Meta Title', type: 'input' },
                                {
                                    name: 'meta_description',
                                    label: 'Meta Description',
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
                            {processing ? 'Saving…' : 'Update Page'}
                        </Button>
                        <EditorialPreviewButton
                            endpoint="/admin/editorial-preview/pages"
                            payload={data}
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

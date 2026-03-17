import AdminLayout from '@/layouts/admin-layout';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { SupportedLocale } from '@/types';

interface Props {
    document: any;
    categories: { id: number; name: string }[];
}

export default function AdminDocumentsEdit({ document, categories }: Props) {
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

    const handleTranslationChange = (lang: SupportedLocale, field: string, value: string) => {
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
                { title: 'Documents', href: '/admin/documents' },
                { title: 'Edit', href: `/admin/documents/${document.id}/edit` },
            ]}
        >
            <Head title="Edit Document" />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">Edit Document</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <Label>Replace File (optional)</Label>
                        <input
                            type="file"
                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                        />
                        {document.file_name && (
                            <p className="text-xs text-muted-foreground">
                                Current file: {document.file_name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Translations</Label>
                        <TranslationTabs
                            fields={[
                                { name: 'title', label: 'Title', type: 'input', required: true },
                                { name: 'description', label: 'Description', type: 'textarea' },
                            ]}
                            data={data.translations}
                            onChange={handleTranslationChange}
                            errors={errors}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : 'Update Document'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

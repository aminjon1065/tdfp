import AdminLayout from '@/layouts/admin-layout';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    categories: { id: number; name: string }[];
}

export default function AdminDocumentsCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        category_id: string;
        file: File | null;
        translations: Record<string, { title: string; description: string }>;
    }>({
        category_id: '',
        file: null,
        translations: {
            en: { title: '', description: '' },
            ru: { title: '', description: '' },
            tj: { title: '', description: '' },
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
        post('/admin/documents');
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Documents', href: '/admin/documents' },
                { title: 'Upload', href: '/admin/documents/create' },
            ]}
        >
            <Head title="Upload Document" />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">Upload Document</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        {errors.category_id && (
                            <p className="text-sm text-destructive">{errors.category_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">
                            File <span className="text-destructive">*</span>
                        </Label>
                        <input
                            id="file"
                            type="file"
                            required
                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                        />
                        {errors.file && (
                            <p className="text-sm text-destructive">{errors.file}</p>
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
                            {processing ? 'Uploading…' : 'Upload Document'}
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

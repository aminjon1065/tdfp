import AdminLayout from '@/layouts/admin-layout';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';

export default function AdminMediaCreate() {
    const { data, setData, post, processing, errors } = useForm<{
        type: 'image' | 'video';
        file: File | null;
        embed_url: string;
        translations: Record<string, { title: string; description: string }>;
    }>({
        type: 'image',
        file: null,
        embed_url: '',
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
        post('/admin/media');
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Media', href: '/admin/media' },
                { title: 'Upload', href: '/admin/media/create' },
            ]}
        >
            <Head title="Upload Media" />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">Upload Media</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <select
                            id="type"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value as 'image' | 'video')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                        </select>
                        {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                    </div>

                    {data.type === 'image' && (
                        <div className="space-y-2">
                            <Label htmlFor="file">
                                Image File <span className="text-destructive">*</span>
                            </Label>
                            <input
                                id="file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                            />
                            {errors.file && (
                                <p className="text-sm text-destructive">{errors.file}</p>
                            )}
                        </div>
                    )}

                    {data.type === 'video' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="file">Video File (optional)</Label>
                                <input
                                    id="file"
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="embed_url">Embed URL (YouTube / Vimeo)</Label>
                                <Input
                                    id="embed_url"
                                    type="url"
                                    value={data.embed_url}
                                    onChange={(e) => setData('embed_url', e.target.value)}
                                    placeholder="https://www.youtube.com/embed/…"
                                />
                                {errors.embed_url && (
                                    <p className="text-sm text-destructive">{errors.embed_url}</p>
                                )}
                            </div>
                        </>
                    )}

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
                            {processing ? 'Uploading…' : 'Upload Media'}
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

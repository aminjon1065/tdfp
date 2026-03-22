import AdminLayout from '@/layouts/admin-layout';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { t } from '@/lib/i18n';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Props {
    categories: { id: number; name: string }[];
}

export default function AdminDocumentsCreate({ categories }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
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
                { title: t(locale, 'admin.content.documents'), href: '/admin/documents' },
                { title: t(locale, 'common.upload'), href: '/admin/documents/create' },
            ]}
        >
            <Head title={`${t(locale, 'common.upload')} ${t(locale, 'admin.content.documents')}`} />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">{t(locale, 'admin.content.uploadDocument')}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="category">{t(locale, 'admin.form.category')}</Label>
                        <select
                            id="category"
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">— {t(locale, 'admin.form.noCategory')} —</option>
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
                            {t(locale, 'common.file')} <span className="text-destructive">*</span>
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
                        <Label>{t(locale, 'common.translations')}</Label>
                        <TranslationTabs
                            fields={[
                                { name: 'title', label: t(locale, 'common.title'), type: 'input', required: true },
                                { name: 'description', label: t(locale, 'common.descriptionLabel'), type: 'textarea' },
                            ]}
                            data={data.translations}
                            onChange={handleTranslationChange}
                            errors={errors}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? t(locale, 'admin.form.currentlyUploading') : t(locale, 'admin.content.uploadDocument')}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            {t(locale, 'common.cancel')}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

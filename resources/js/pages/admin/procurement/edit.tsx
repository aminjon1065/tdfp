import AdminLayout from '@/layouts/admin-layout';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    procurement: any;
}

export default function AdminProcurementEdit({ procurement }: Props) {
    const translationsMap =
        procurement.translations?.reduce((acc: any, t: any) => {
            acc[t.language] = {
                title: t.title ?? '',
                description: t.description ?? '',
            };
            return acc;
        }, {}) ?? {};

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        reference_number: procurement.reference_number ?? '',
        status: procurement.status ?? 'open',
        publication_date: procurement.publication_date ?? '',
        deadline: procurement.deadline ?? '',
        translations: {
            en: translationsMap['en'] ?? { title: '', description: '' },
            ru: translationsMap['ru'] ?? { title: '', description: '' },
            tj: translationsMap['tj'] ?? { title: '', description: '' },
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
        post(`/admin/procurement/${procurement.id}`);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Procurement', href: '/admin/procurement' },
                { title: 'Edit', href: `/admin/procurement/${procurement.id}/edit` },
            ]}
        >
            <Head title="Edit Procurement" />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">Edit Procurement</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Reference Number</Label>
                            <Input
                                value={data.reference_number}
                                onChange={(e) => setData('reference_number', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                                <option value="awarded">Awarded</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Publication Date</Label>
                            <Input
                                type="date"
                                value={data.publication_date}
                                onChange={(e) => setData('publication_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Deadline</Label>
                            <Input
                                type="date"
                                value={data.deadline}
                                onChange={(e) => setData('deadline', e.target.value)}
                            />
                        </div>
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
                            {processing ? 'Saving…' : 'Update Procurement'}
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

import AdminLayout from '@/layouts/admin-layout';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';

export default function AdminProcurementCreate() {
    const { data, setData, post, processing, errors } = useForm<{
        reference_number: string;
        status: string;
        publication_date: string;
        deadline: string;
        translations: Record<string, { title: string; description: string }>;
    }>({
        reference_number: '',
        status: 'open',
        publication_date: '',
        deadline: '',
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
        post('/admin/procurement');
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Procurement', href: '/admin/procurement' },
                { title: 'Create', href: '/admin/procurement/create' },
            ]}
        >
            <Head title="Create Procurement" />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">Create Procurement</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="reference_number">Reference Number</Label>
                            <Input
                                id="reference_number"
                                value={data.reference_number}
                                onChange={(e) => setData('reference_number', e.target.value)}
                                placeholder="e.g. TDFP-2025-001"
                            />
                            {errors.reference_number && (
                                <p className="text-sm text-destructive">{errors.reference_number}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
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
                            <Label htmlFor="publication_date">Publication Date</Label>
                            <Input
                                id="publication_date"
                                type="date"
                                value={data.publication_date}
                                onChange={(e) => setData('publication_date', e.target.value)}
                            />
                            {errors.publication_date && (
                                <p className="text-sm text-destructive">{errors.publication_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={data.deadline}
                                onChange={(e) => setData('deadline', e.target.value)}
                            />
                            {errors.deadline && (
                                <p className="text-sm text-destructive">{errors.deadline}</p>
                            )}
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
                            {processing ? 'Saving…' : 'Create Procurement'}
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

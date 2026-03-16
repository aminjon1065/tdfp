import AdminLayout from '@/layouts/admin-layout';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    activity: any;
}

export default function AdminActivitiesEdit({ activity }: Props) {
    const translationsMap =
        activity.translations?.reduce((acc: any, t: any) => {
            acc[t.language] = {
                title: t.title ?? '',
                description: t.description ?? '',
                objectives: t.objectives ?? '',
            };
            return acc;
        }, {}) ?? {};

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        status: activity.status ?? 'planned',
        start_date: activity.start_date ?? '',
        end_date: activity.end_date ?? '',
        featured_image: null as File | null,
        translations: {
            en: translationsMap['en'] ?? { title: '', description: '', objectives: '' },
            ru: translationsMap['ru'] ?? { title: '', description: '', objectives: '' },
            tj: translationsMap['tj'] ?? { title: '', description: '', objectives: '' },
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
        post(`/admin/activities/${activity.id}`);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Activities', href: '/admin/activities' },
                { title: 'Edit', href: `/admin/activities/${activity.id}/edit` },
            ]}
        >
            <Head title="Edit Activity" />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">Edit Activity</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="planned">Planned</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                            />
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
                        {activity.featured_image_url && (
                            <img
                                src={activity.featured_image_url}
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
                                { name: 'description', label: 'Description', type: 'textarea' },
                                { name: 'objectives', label: 'Objectives', type: 'textarea' },
                            ]}
                            data={data.translations}
                            onChange={handleTranslationChange}
                            errors={errors}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : 'Update Activity'}
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

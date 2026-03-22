import AdminLayout from '@/layouts/admin-layout';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { t } from '@/lib/i18n';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export default function AdminActivitiesCreate() {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const { data, setData, post, processing, errors } = useForm<{
        status: string;
        start_date: string;
        end_date: string;
        featured_image: File | null;
        translations: Record<
            string,
            { title: string; description: string; objectives: string }
        >;
    }>({
        status: 'planned',
        start_date: '',
        end_date: '',
        featured_image: null,
        translations: {
            en: { title: '', description: '', objectives: '' },
            ru: { title: '', description: '', objectives: '' },
            tj: { title: '', description: '', objectives: '' },
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
        post('/admin/activities');
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: t(locale, 'admin.nav.activities'), href: '/admin/activities' },
                { title: t(locale, 'admin.form.create'), href: '/admin/activities/create' },
            ]}
        >
            <Head title={`${t(locale, 'admin.form.create')} ${t(locale, 'admin.nav.activities')}`} />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">{t(locale, 'admin.form.create')} {t(locale, 'admin.nav.activities')}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="status">{t(locale, 'admin.form.status')}</Label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="planned">{t(locale, 'status.planned')}</option>
                                <option value="in_progress">{t(locale, 'status.in_progress')}</option>
                                <option value="completed">{t(locale, 'status.completed')}</option>
                            </select>
                            {errors.status && (
                                <p className="text-sm text-destructive">{errors.status}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="start_date">{t(locale, 'admin.form.startDate')}</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                            {errors.start_date && (
                                <p className="text-sm text-destructive">{errors.start_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_date">{t(locale, 'admin.form.endDate')}</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                            />
                            {errors.end_date && (
                                <p className="text-sm text-destructive">{errors.end_date}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="featured_image">{t(locale, 'admin.form.featuredImage')}</Label>
                        <input
                            id="featured_image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('featured_image', e.target.files?.[0] ?? null)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t(locale, 'common.translations')}</Label>
                        <TranslationTabs
                            fields={[
                                { name: 'title', label: t(locale, 'common.title'), type: 'input', required: true },
                                { name: 'description', label: t(locale, 'common.descriptionLabel'), type: 'textarea' },
                                { name: 'objectives', label: t(locale, 'common.objectives'), type: 'textarea' },
                            ]}
                            data={data.translations}
                            onChange={handleTranslationChange}
                            errors={errors}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? t(locale, 'admin.content.saving') : `${t(locale, 'common.create')} ${t(locale, 'admin.nav.activities')}`}
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

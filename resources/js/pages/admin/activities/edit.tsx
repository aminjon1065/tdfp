import AdminLayout from '@/layouts/admin-layout';
import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { t } from '@/lib/i18n';
import { Head, useForm, usePage } from '@inertiajs/react';
import { SupportedLocale, type SharedData } from '@/types';

interface Props {
    activity: any;
}

export default function AdminActivitiesEdit({ activity }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const translationsMap =
        activity.translations?.reduce((acc: any, t: any) => {
            acc[t.language] = {
                title: t.title ?? '',
                description: t.description ?? '',
                objectives: t.objectives ?? '',
            };
            return acc;
        }, {}) ?? {};

    const domainOptions = [
        { value: '', label: '— None —' },
        { value: 'digital-infrastructure', label: 'Digital Infrastructure' },
        { value: 'digital-public-services', label: 'Digital Public Services' },
        { value: 'digital-identity-payments', label: 'Digital Identity & Payments' },
        { value: 'cybersecurity', label: 'Cybersecurity' },
        { value: 'legal-governance', label: 'Legal & Governance' },
        { value: 'digital-skills', label: 'Digital Skills' },
        { value: 'school-connectivity', label: 'School Connectivity' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        status: activity.status ?? 'planned',
        domain_slug: activity.domain_slug ?? '',
        activity_number: activity.activity_number?.toString() ?? '',
        start_date: activity.start_date ?? '',
        end_date: activity.end_date ?? '',
        featured_image: null as File | null,
        translations: {
            en: translationsMap['en'] ?? { title: '', description: '', objectives: '' },
            ru: translationsMap['ru'] ?? { title: '', description: '', objectives: '' },
            tj: translationsMap['tj'] ?? { title: '', description: '', objectives: '' },
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
        post(`/admin/activities/${activity.id}`);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: t(locale, 'admin.nav.activities'), href: '/admin/activities' },
                { title: t(locale, 'admin.form.edit'), href: `/admin/activities/${activity.id}/edit` },
            ]}
        >
            <Head title={`${t(locale, 'admin.form.edit')} ${t(locale, 'admin.nav.activities')}`} />
            <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">{t(locale, 'admin.form.edit')} {t(locale, 'admin.nav.activities')}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Implementation Domain</Label>
                            <select
                                value={data.domain_slug}
                                onChange={(e) => setData('domain_slug', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                {domainOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Activity Number (1–34)</Label>
                            <Input
                                type="number"
                                min={1}
                                max={34}
                                value={data.activity_number}
                                onChange={(e) => setData('activity_number', e.target.value)}
                                placeholder="e.g. 7"
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label>{t(locale, 'admin.form.status')}</Label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="planned">{t(locale, 'status.planned')}</option>
                                <option value="in_progress">{t(locale, 'status.in_progress')}</option>
                                <option value="completed">{t(locale, 'status.completed')}</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>{t(locale, 'admin.form.startDate')}</Label>
                            <Input
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t(locale, 'admin.form.endDate')}</Label>
                            <Input
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t(locale, 'admin.form.featuredImage')}</Label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('featured_image', e.target.files?.[0] ?? null)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                        />
                        {activity.featured_image_url && (
                            <img
                                src={activity.featured_image_url}
                                alt={t(locale, 'admin.form.currentFeaturedImage')}
                                className="h-24 w-auto rounded-md object-cover"
                            />
                        )}
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
                            {processing ? t(locale, 'admin.content.saving') : `${t(locale, 'common.update')} ${t(locale, 'admin.nav.activities')}`}
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

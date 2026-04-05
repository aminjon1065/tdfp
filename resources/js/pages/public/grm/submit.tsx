import { useForm, usePage } from '@inertiajs/react';

import PageHero from '@/components/page-hero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/public-layout';
import { t } from '@/lib/i18n';

interface Props {
    attachmentConstraints: {
        accept: string;
        allowed_extensions: string[];
        max_files: number;
        max_file_size_mb: number;
    };
}

export default function GrmSubmit({ attachmentConstraints }: Props) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const { data, setData, post, processing, errors } = useForm({
        complainant_name: '',
        email: '',
        phone: '',
        category: 'other',
        description: '',
        attachments: [] as File[],
    });
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t(locale, 'grm.submit'),
        description: t(locale, 'grm.description'),
        inLanguage: locale,
        url: currentUrl || undefined,
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/grm/submit');
    };

    return (
        <PublicLayout
            title={t(locale, 'grm.submit')}
            description={t(locale, 'grm.description')}
            structuredData={structuredData}
            seoType="website"
            blendHeader
        >
            <PageHero
                title={t(locale, 'grm.submitTitle')}
                subtitle={t(locale, 'grm.title')}
                description={t(locale, 'grm.submitLead')}
                compact
            />
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    encType="multipart/form-data"
                    noValidate
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="name">
                            {t(locale, 'grm.fullName')}{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="complainant_name"
                            autoComplete="name"
                            value={data.complainant_name}
                            onChange={(e) =>
                                setData('complainant_name', e.target.value)
                            }
                            aria-invalid={!!errors.complainant_name}
                            aria-describedby={
                                errors.complainant_name
                                    ? 'complainant-name-error'
                                    : undefined
                            }
                        />
                        {errors.complainant_name && (
                            <p
                                id="complainant-name-error"
                                role="alert"
                                className="text-sm text-red-600"
                            >
                                {errors.complainant_name}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">
                                {t(locale, 'common.email')}{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                aria-invalid={!!errors.email}
                                aria-describedby={
                                    errors.email ? 'grm-email-error' : undefined
                                }
                            />
                            {errors.email && (
                                <p
                                    id="grm-email-error"
                                    role="alert"
                                    className="text-sm text-red-600"
                                >
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="phone">
                                {t(locale, 'grm.phoneOptional')}
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                autoComplete="tel"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="category">
                            {t(locale, 'grm.categoryLabel')}{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <select
                            id="category"
                            name="category"
                            value={data.category}
                            onChange={(e) =>
                                setData('category', e.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            aria-invalid={!!errors.category}
                            aria-describedby={
                                errors.category
                                    ? 'grm-category-error'
                                    : undefined
                            }
                        >
                            <option value="procurement">
                                {t(locale, 'grm.category.procurement')}
                            </option>
                            <option value="project_implementation">
                                {t(
                                    locale,
                                    'grm.category.project_implementation',
                                )}
                            </option>
                            <option value="environment_social">
                                {t(locale, 'grm.category.environment_social')}
                            </option>
                            <option value="corruption">
                                {t(locale, 'grm.category.corruption')}
                            </option>
                            <option value="other">
                                {t(locale, 'grm.category.other')}
                            </option>
                        </select>
                        {errors.category && (
                            <p
                                id="grm-category-error"
                                role="alert"
                                className="text-sm text-red-600"
                            >
                                {errors.category}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <Label htmlFor="description">
                                {t(locale, 'grm.descriptionLabel')}{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <span
                                className={`text-xs tabular-nums ${data.description.length > 1800 ? 'text-orange-600' : 'text-gray-400'}`}
                                aria-live="polite"
                                aria-label={`${data.description.length} characters entered`}
                            >
                                {data.description.length} / 2000
                            </span>
                        </div>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={6}
                            maxLength={2000}
                            placeholder={t(
                                locale,
                                'grm.descriptionPlaceholder',
                            )}
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            aria-invalid={!!errors.description}
                            aria-describedby={`grm-description-help${errors.description ? ' grm-description-error' : ''}`}
                        />
                        <p
                            id="grm-description-help"
                            className="text-sm text-gray-500"
                        >
                            {t(locale, 'grm.descriptionHelp')}
                        </p>
                        {errors.description && (
                            <p
                                id="grm-description-error"
                                role="alert"
                                className="text-sm text-red-600"
                            >
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="attachments">
                            {t(locale, 'grm.attachmentsOptional')}
                        </Label>
                        <input
                            id="attachments"
                            name="attachments"
                            type="file"
                            multiple
                            accept={attachmentConstraints.accept}
                            onChange={(e) =>
                                setData(
                                    'attachments',
                                    Array.from(e.target.files ?? []),
                                )
                            }
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm"
                            aria-invalid={
                                !!errors.attachments ||
                                !!errors['attachments.0']
                            }
                            aria-describedby={`grm-attachments-help${errors.attachments || errors['attachments.0'] ? ' grm-attachments-error' : ''}`}
                        />
                        <p
                            id="grm-attachments-help"
                            className="text-sm text-gray-500"
                        >
                            {t(locale, 'grm.attachmentsHelpPrefix')}{' '}
                            {attachmentConstraints.allowed_extensions.join(
                                ', ',
                            )}
                            . {attachmentConstraints.max_files}{' '}
                            {t(locale, 'grm.attachmentsHelpSuffix')},{' '}
                            {attachmentConstraints.max_file_size_mb} MB each.
                        </p>
                        {(errors.attachments || errors['attachments.0']) && (
                            <p
                                id="grm-attachments-error"
                                role="alert"
                                className="text-sm text-red-600"
                            >
                                {errors.attachments ?? errors['attachments.0']}
                            </p>
                        )}
                    </div>

                    <div
                        id="grm-privacy-notice"
                        className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
                    >
                        <strong>{t(locale, 'grm.privacyNoticeLabel')}</strong>{' '}
                        {t(locale, 'grm.privacyNoticeText')}
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-orange-700 text-white hover:bg-orange-800"
                        size="lg"
                    >
                        {processing
                            ? t(locale, 'grm.submitting')
                            : t(locale, 'grm.submit')}
                    </Button>
                </form>
            </div>
        </PublicLayout>
    );
}

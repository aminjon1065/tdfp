import { router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

import PageHero from '@/components/page-hero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/public-layout';
import {
    formatLocalizedDate,
    formatLocalizedDateTime,
    getStatusLabel,
    t,
} from '@/lib/i18n';

interface Props {
    trackingRequirements: {
        ticket_number_pattern: string;
        tracking_token_length: number;
    };
    case?: {
        ticket_number: string;
        status: string;
        created_at: string;
        statusHistory: { status: string; created_at: string }[];
    };
    notFound?: boolean;
    trackingExpired?: boolean;
}

export default function GrmTrack({
    case: grmCase,
    notFound,
    trackingExpired,
    trackingRequirements,
}: Props) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const { data, setData, processing, errors } = useForm({
        ticket_number: '',
        tracking_token: '',
    });
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t(locale, 'grm.track'),
        description: t(locale, 'grm.description'),
        inLanguage: locale,
        url: currentUrl || undefined,
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/grm/track', data);
    };

    return (
        <PublicLayout
            title={t(locale, 'grm.track')}
            description={t(locale, 'grm.description')}
            structuredData={structuredData}
            seoType="website"
            noIndex
            blendHeader
        >
            <PageHero
                title={t(locale, 'grm.trackTitle')}
                subtitle={t(locale, 'grm.title')}
                description={t(locale, 'grm.trackLead')}
                compact
            />
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <form
                    onSubmit={handleSearch}
                    className="mb-8 space-y-4"
                    noValidate
                >
                    <div className="grid flex-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="ticket_number">
                                {t(locale, 'grm.ticketNumber')}
                            </Label>
                            <Input
                                id="ticket_number"
                                name="ticket_number"
                                value={data.ticket_number}
                                onChange={(e) =>
                                    setData(
                                        'ticket_number',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="GRM-2026-00001"
                                autoComplete="off"
                                pattern={
                                    trackingRequirements.ticket_number_pattern
                                }
                                aria-invalid={!!errors.ticket_number}
                                aria-describedby={`ticket-number-help${errors.ticket_number ? ' ticket-number-error' : ''}`}
                            />
                            <p
                                id="ticket-number-help"
                                className="text-sm text-gray-500"
                            >
                                {t(locale, 'grm.ticketFormatHelp')}
                            </p>
                            {errors.ticket_number && (
                                <p
                                    id="ticket-number-error"
                                    role="alert"
                                    className="text-sm text-red-600"
                                >
                                    {errors.ticket_number}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tracking_token">
                                {t(locale, 'grm.trackingToken')}
                            </Label>
                            <Input
                                id="tracking_token"
                                name="tracking_token"
                                value={data.tracking_token}
                                onChange={(e) =>
                                    setData(
                                        'tracking_token',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                placeholder={t(
                                    locale,
                                    'grm.trackingTokenPlaceholder',
                                )}
                                autoComplete="off"
                                aria-invalid={!!errors.tracking_token}
                                aria-describedby={`tracking-token-help${errors.tracking_token ? ' tracking-token-error' : ''}`}
                            />
                            <p
                                id="tracking-token-help"
                                className="text-sm text-gray-500"
                            >
                                {`${t(locale, 'grm.trackingTokenHelpPrefix')} ${trackingRequirements.tracking_token_length} ${t(locale, 'grm.trackingTokenHelpSuffix')}`}
                            </p>
                            {errors.tracking_token && (
                                <p
                                    id="tracking-token-error"
                                    role="alert"
                                    className="text-sm text-red-600"
                                >
                                    {errors.tracking_token}
                                </p>
                            )}
                        </div>
                    </div>
                    <Button type="submit" disabled={processing}>
                        {processing
                            ? t(locale, 'grm.searching')
                            : t(locale, 'grm.track')}
                    </Button>
                </form>

                {notFound && (
                    <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {t(locale, 'grm.notFound')}
                    </div>
                )}

                {trackingExpired && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
                    >
                        {t(locale, 'grm.trackingExpired')}
                    </div>
                )}

                {grmCase && (
                    <div className="space-y-4" aria-live="polite">
                        <div className="rounded-lg border p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="font-mono text-lg font-bold text-blue-700">
                                    {grmCase.ticket_number}
                                </p>
                                <Badge>
                                    {getStatusLabel(grmCase.status, locale)}
                                </Badge>
                            </div>
                            <div className="grid gap-3 text-sm sm:grid-cols-2">
                                <div>
                                    <span className="text-gray-500">
                                        {t(locale, 'grm.submittedOn')}
                                    </span>{' '}
                                    <span className="font-medium">
                                        {formatLocalizedDate(
                                            grmCase.created_at,
                                            locale,
                                        )}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">
                                        {t(locale, 'grm.progress')}
                                    </span>{' '}
                                    <span className="font-medium">
                                        {grmCase.statusHistory.length}{' '}
                                        {t(locale, 'grm.updates')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-3 font-semibold text-gray-900">
                                {t(locale, 'grm.statusHistory')}
                            </h2>
                            <ol className="space-y-3">
                                {grmCase.statusHistory.map((h, i) => (
                                    <li key={i} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <CheckCircle
                                                className="h-5 w-5 text-green-500"
                                                aria-hidden="true"
                                            />
                                            {i <
                                                grmCase.statusHistory.length -
                                                    1 && (
                                                <div className="mt-1 w-0.5 flex-1 bg-gray-200" />
                                            )}
                                        </div>
                                        <div className="pb-3">
                                            <p className="text-sm font-medium">
                                                {getStatusLabel(
                                                    h.status,
                                                    locale,
                                                )}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-400">
                                                <time dateTime={h.created_at}>
                                                    {formatLocalizedDateTime(
                                                        h.created_at,
                                                        locale,
                                                    )}
                                                </time>
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

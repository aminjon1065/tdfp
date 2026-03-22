import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    FileText,
    Megaphone,
    MessageCircleWarning,
    ShoppingBag,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PublicImage from '@/components/public-image';
import PublicLayout from '@/layouts/public-layout';
import {
    formatLocalizedDate,
    getStatusLabel,
    getTranslation,
    t,
} from '@/lib/i18n';

interface TranslationRecord {
    language?: string;
    title?: string;
    summary?: string;
    description?: string;
}

interface ContentItem {
    id: number;
    slug: string;
    status: string;
    is_featured?: boolean;
    featured_image?: string | null;
    published_at?: string | null;
    category?: {
        name: string;
    } | null;
    translations?: TranslationRecord[];
}

interface ProcurementItem {
    id: number;
    status: string;
    reference_number: string;
    deadline?: string | null;
    translations?: TranslationRecord[];
}

interface Props {
    latestNews: ContentItem[];
    whatsNew: ContentItem[];
    newsRecentWindowDays: number;
    activities: ContentItem[];
    latestDocuments: Record<string, unknown>[];
    openProcurements: ProcurementItem[];
    settings: Record<string, string>;
}

const serviceCards = [
    {
        title: 'Project activities',
        description:
            'Track implementation progress and published updates from the project.',
        href: '/activities',
        icon: Megaphone,
    },
    {
        title: 'Procurement notices',
        description:
            'Review open notices, references, and deadlines for suppliers.',
        href: '/procurement',
        icon: ShoppingBag,
    },
    {
        title: 'Public documents',
        description:
            'Access official project documents and published materials.',
        href: '/documents',
        icon: FileText,
    },
];

export default function Home({
    latestNews,
    whatsNew,
    newsRecentWindowDays,
    activities,
    latestDocuments,
    openProcurements,
    settings,
}: Props) {
    const page = usePage<{ locale?: string; ziggy?: { location?: string } }>().props;
    const locale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const isRecent = (publishedAt?: string | null) =>
        publishedAt
        && ((Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24)) <= newsRecentWindowDays;
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: t(locale, 'home.title'),
            description: t(locale, 'home.description'),
            inLanguage: locale,
            url: currentUrl || undefined,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: t(locale, 'home.latestNews'),
            itemListElement: latestNews.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: getTranslation(item, locale).title ?? `News ${item.id}`,
                url: currentUrl ? new URL(`/news/${item.slug}`, currentUrl).toString() : undefined,
            })),
        },
    ];

    return (
        <PublicLayout
            title={t(locale, 'home.title')}
            description={t(locale, 'home.description')}
            structuredData={structuredData}
            seoType="website"
        >
            <Head title={`${t(locale, 'common.home')} | PIC TDFP`} />

            <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
                <div className="gov-container py-16 md:py-20">
                    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                        <div>
                            <p className="gov-kicker mb-4">
                                Modern Gov Service
                            </p>
                            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-[var(--gov-navy-strong)] md:text-6xl">
                                Official project information and citizen
                                services.
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                                Find verified updates, procurement notices,
                                documents, and grievance redress services
                                through a clear and accessible public portal.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    size="lg"
                                    className="rounded-lg bg-[var(--gov-blue)] px-6 text-white hover:bg-[var(--gov-navy)]"
                                >
                                    <Link href="/project">
                                        {t(locale, 'home.learnMore')}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="rounded-lg border-slate-300 bg-white px-6 text-slate-700 hover:border-[var(--gov-blue)] hover:text-[var(--gov-blue)]"
                                >
                                    <Link href="/grm/submit">
                                        <MessageCircleWarning className="mr-2 h-4 w-4" />
                                        {t(locale, 'grm.submit')}
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="gov-panel p-6 md:p-7">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Project components
                                    </p>
                                    <p className="mt-2 text-4xl font-semibold text-[var(--gov-navy-strong)]">
                                        10+
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Budget envelope
                                    </p>
                                    <p className="mt-2 text-4xl font-semibold text-[var(--gov-navy-strong)]">
                                        $40M
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {t(locale, 'home.activities')}
                                    </p>
                                    <p className="mt-2 text-4xl font-semibold text-[var(--gov-navy-strong)]">
                                        {activities.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {t(locale, 'home.documents')}
                                    </p>
                                    <p className="mt-2 text-4xl font-semibold text-[var(--gov-navy-strong)]">
                                        {latestDocuments.length}+
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-lg bg-[var(--gov-mist)] p-4 text-sm text-slate-600">
                                Official contact:{' '}
                                {settings.contact_email ?? 'info@example.tj'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-14">
                <div className="gov-container">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="gov-kicker mb-3">Services</p>
                            <h2 className="gov-section-title">
                                Start from the service you need.
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-3">
                        {serviceCards.map((card) => (
                            <Link
                                key={card.href}
                                href={card.href}
                                className="gov-panel group p-6 transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <card.icon className="h-6 w-6 text-[var(--gov-blue)]" />
                                <h3 className="mt-5 text-xl font-semibold text-[var(--gov-navy-strong)]">
                                    {card.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {card.description}
                                </p>
                                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--gov-blue)]">
                                    Open service
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y border-slate-200 bg-white">
                <div className="gov-container py-14">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="gov-kicker mb-3">{t(locale, 'news.whatsNew')}</p>
                            <h2 className="gov-section-title">
                                {t(locale, 'news.whatsNewDescription')}
                            </h2>
                        </div>
                        <Link
                            href="/news"
                            className="text-sm font-medium text-[var(--gov-blue)] hover:text-[var(--gov-navy)]"
                        >
                            {t(locale, 'common.viewAll')}
                        </Link>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-3">
                        {whatsNew.slice(0, 3).map((item) => {
                            const translation = getTranslation(item, locale);

                            return (
                                <article
                                    key={item.id}
                                    className="gov-panel overflow-hidden"
                                >
                                    {item.featured_image && (
                                        <div className="aspect-[16/9] bg-slate-200">
                                            <PublicImage
                                                src={`/storage/${item.featured_image}`}
                                                alt={translation.title}
                                                className="h-full w-full object-cover"
                                                priority={false}
                                                sizes="(min-width: 1024px) 30vw, 100vw"
                                            />
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <Badge className="rounded-md bg-[var(--gov-mist)] text-[var(--gov-blue)] shadow-none">
                                                    {item.category?.name ??
                                                        'Update'}
                                                </Badge>
                                                {item.is_featured && (
                                                    <Badge className="rounded-md bg-[var(--gov-blue)] text-white shadow-none">
                                                        {t(locale, 'news.featured')}
                                                    </Badge>
                                                )}
                                                {isRecent(item.published_at) && (
                                                    <Badge variant="outline" className="rounded-md border-emerald-200 bg-emerald-50 text-emerald-700 shadow-none">
                                                        {t(locale, 'news.new')}
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-xs text-slate-400">
                                                {formatLocalizedDate(item.published_at, locale)}
                                            </span>
                                        </div>

                                        <h3 className="mt-4 text-xl font-semibold text-[var(--gov-navy-strong)]">
                                            {translation.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-7 text-slate-600">
                                            {translation.summary}
                                        </p>
                                        <Link
                                            href={`/news/${item.slug}`}
                                            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--gov-blue)]"
                                        >
                                            {t(locale, 'common.readMore')}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-14">
                <div className="gov-container grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="gov-panel p-6 md:p-7">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <p className="gov-kicker mb-2">Activities</p>
                                <h2 className="text-2xl font-semibold text-[var(--gov-navy-strong)]">
                                    Current implementation activity
                                </h2>
                            </div>
                            <Link
                                href="/activities"
                                className="text-sm font-medium text-[var(--gov-blue)]"
                            >
                                {t(locale, 'common.viewAll')}
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {activities.slice(0, 3).map((activity) => {
                                const translation = getTranslation(
                                    activity,
                                    locale,
                                );

                                return (
                                    <div
                                        key={activity.id}
                                        className="rounded-lg border border-slate-200 bg-slate-50/80 p-4"
                                    >
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Badge className="rounded-md bg-white text-[var(--gov-blue)] shadow-none">
                                                {getStatusLabel(
                                                    activity.status,
                                                    locale,
                                                )}
                                            </Badge>
                                        </div>
                                        <h3 className="mt-3 text-lg font-semibold text-[var(--gov-navy-strong)]">
                                            {translation.title ??
                                                t(locale, 'activities.title')}
                                        </h3>
                                        <p className="mt-2 text-sm leading-7 text-slate-600">
                                            {translation.description ??
                                                t(locale, 'common.noData')}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="gov-panel p-6 md:p-7">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <p className="gov-kicker mb-2">
                                        Procurement
                                    </p>
                                    <h2 className="text-2xl font-semibold text-[var(--gov-navy-strong)]">
                                        Open notices
                                    </h2>
                                </div>
                                <Link
                                    href="/procurement"
                                    className="text-sm font-medium text-[var(--gov-blue)]"
                                >
                                    {t(locale, 'common.viewAll')}
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {openProcurements.map((item) => {
                                    const translation = getTranslation(
                                        item,
                                        locale,
                                    );

                                    return (
                                        <div
                                            key={item.id}
                                            className="rounded-lg border border-slate-200 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs font-medium tracking-[0.16em] text-slate-400 uppercase">
                                                        {item.reference_number}
                                                    </p>
                                                    <h3 className="mt-2 text-lg font-semibold text-[var(--gov-navy-strong)]">
                                                        {translation.title ??
                                                            t(
                                                                locale,
                                                                'common.untitled',
                                                            )}
                                                    </h3>
                                                </div>
                                                <Badge className="rounded-md bg-[var(--gov-mist)] text-[var(--gov-blue)] shadow-none">
                                                    {getStatusLabel(
                                                        item.status,
                                                        locale,
                                                    )}
                                                </Badge>
                                            </div>
                                            {item.deadline && (
                                                <p className="mt-3 text-sm text-slate-600">
                                                    {t(
                                                        locale,
                                                        'common.deadline',
                                                    )}
                                                    :{' '}
                                                    {formatLocalizedDate(
                                                        item.deadline,
                                                        locale,
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-[linear-gradient(135deg,var(--gov-blue),var(--gov-navy))] p-7 text-white shadow-lg">
                            <p className="text-sm font-semibold tracking-[0.22em] text-white/70 uppercase">
                                GRM Service
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold">
                                {t(locale, 'grm.title')}
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-white/78">
                                {t(locale, 'grm.description')}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    className="rounded-lg bg-white text-[var(--gov-navy)] hover:bg-slate-100"
                                >
                                    <Link href="/grm/submit">
                                        {t(locale, 'grm.submit')}
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-lg border-white/30 bg-transparent text-white hover:bg-white hover:text-[var(--gov-navy)]"
                                >
                                    <Link href="/grm/track">
                                        {t(locale, 'grm.track')}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

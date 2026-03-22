import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, FileText, Megaphone, ShoppingBag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import {
    formatLocalizedDate,
    getStatusLabel,
    getTranslation,
    t,
} from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';

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
    const page = usePage<{ locale?: string; ziggy?: { location?: string } }>()
        .props;
    const locale = page.locale ?? 'en';
    const defaultLocale =
        (page as { localization?: { default_locale?: string } }).localization
            ?.default_locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const publicHref = (path: string) =>
        localizedPublicHref(path, locale, defaultLocale);
    const isRecent = (publishedAt?: string | null) =>
        publishedAt &&
        (Date.now() - new Date(publishedAt).getTime()) /
            (1000 * 60 * 60 * 24) <=
            newsRecentWindowDays;
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
                url: currentUrl
                    ? new URL(`/news/${item.slug}`, currentUrl).toString()
                    : undefined,
            })),
        },
    ];

    return (
        <PublicLayout
            title={t(locale, 'home.title')}
            description={t(locale, 'home.description')}
            structuredData={structuredData}
            seoType="website"
            blendHeader
        >
            <Head title={`${t(locale, 'common.home')} | PIC TDFP`} />

            <section className="gov-hero-shell">
                <div className="gov-container py-18 md:py-24">
                    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                        <div className="max-w-3xl">
                            <p className="gov-kicker mb-5 text-[var(--gov-gold)]">
                                Tajikistan Digital Foundations Project
                            </p>
                            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                                Official project portal for public information,
                                procurement, and grievance access.
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                                A single institutional portal for verified
                                updates, key project activities, official
                                documents, and public-facing service channels.
                            </p>

                            <div className="mt-9 flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    size="lg"
                                    className="rounded-full bg-[var(--gov-gold)] px-6 text-white hover:bg-[#e4ab40]"
                                >
                                    <Link href={publicHref('/project')}>
                                        {t(locale, 'home.learnMore')}
                                    </Link>
                                </Button>
                                <Link
                                    href={publicHref('/contact')}
                                    className="gov-pill-link"
                                >
                                    Contact
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="gov-stat-card bg-white/95">
                                    <p className="text-xs font-medium tracking-[0.22em] text-[var(--gov-blue)] uppercase">
                                        Key focus
                                    </p>
                                    <p className="mt-3 text-4xl font-semibold text-[var(--gov-navy-strong)]">
                                        10+
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Project components
                                    </p>
                                </div>
                                <div className="gov-stat-card bg-white/95">
                                    <p className="text-xs font-medium tracking-[0.22em] text-[var(--gov-blue)] uppercase">
                                        Budget
                                    </p>
                                    <p className="mt-3 text-4xl font-semibold text-[var(--gov-navy-strong)]">
                                        $40M
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Financing envelope
                                    </p>
                                </div>
                                <div className="gov-stat-card bg-white/95">
                                    <p className="text-xs font-medium tracking-[0.22em] text-[var(--gov-blue)] uppercase">
                                        {t(locale, 'home.activities')}
                                    </p>
                                    <p className="mt-3 text-4xl font-semibold text-[var(--gov-navy-strong)]">
                                        {activities.length}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Published activity records
                                    </p>
                                </div>
                                <div className="gov-stat-card bg-white/95">
                                    <p className="text-xs font-medium tracking-[0.22em] text-[var(--gov-blue)] uppercase">
                                        {t(locale, 'home.documents')}
                                    </p>
                                    <p className="mt-3 text-4xl font-semibold text-[var(--gov-navy-strong)]">
                                        {latestDocuments.length}+
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Published documents
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-2xl border border-white/10 bg-white/8 px-5 py-4 text-sm text-white/78">
                                Official contact:{' '}
                                {settings.contact_email ?? 'info@example.tj'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                            <p className="text-3xl font-semibold text-[var(--gov-gold)]">
                                30+
                            </p>
                            <p className="mt-2 text-sm text-white/66">
                                Operational content units and updates
                            </p>
                        </div>
                        <div>
                            <p className="text-3xl font-semibold text-[var(--gov-gold)]">
                                200+
                            </p>
                            <p className="mt-2 text-sm text-white/66">
                                Stakeholder interactions and published records
                            </p>
                        </div>
                        <div>
                            <p className="text-3xl font-semibold text-[var(--gov-gold)]">
                                50+
                            </p>
                            <p className="mt-2 text-sm text-white/66">
                                Project documents and notices in circulation
                            </p>
                        </div>
                        <div>
                            <p className="text-3xl font-semibold text-[var(--gov-gold)]">
                                15+
                            </p>
                            <p className="mt-2 text-sm text-white/66">
                                Priority workstreams and procurement milestones
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[var(--gov-surface)]">
                <div className="gov-container py-16">
                    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                        <div>
                            <p className="gov-kicker mb-4">Our mission</p>
                            <h2 className="gov-section-title">
                                A credible digital public portal with clear
                                access to project information.
                            </h2>
                            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-600">
                                {settings.site_description ??
                                    'The portal supports public transparency, institutional communication, and accessible service delivery for project beneficiaries, partners, and citizens.'}
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={publicHref('/about')}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--gov-blue)]"
                                >
                                    Learn more
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="gov-stat-card">
                                <p className="text-3xl font-semibold text-[var(--gov-navy-strong)]">
                                    30+
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Public content areas
                                </p>
                            </div>
                            <div className="gov-stat-card">
                                <p className="text-3xl font-semibold text-[var(--gov-navy-strong)]">
                                    200+
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Visible operational records
                                </p>
                            </div>
                            <div className="gov-stat-card">
                                <p className="text-3xl font-semibold text-[var(--gov-navy-strong)]">
                                    50+
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Published reference materials
                                </p>
                            </div>
                            <div className="gov-stat-card">
                                <p className="text-3xl font-semibold text-[var(--gov-navy-strong)]">
                                    15+
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Current implementation priorities
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="gov-soft-section border-y border-[#e5e0d4]">
                <div className="gov-container py-16">
                    <div className="mb-8">
                        <p className="gov-kicker mb-3">Activities</p>
                        <h2 className="gov-section-title">
                            Core implementation directions
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {activities.slice(0, 6).map((activity) => {
                            const translation = getTranslation(
                                activity,
                                locale,
                            );

                            return (
                                <article
                                    key={activity.id}
                                    className="gov-panel p-5 transition hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <Badge className="rounded-full bg-[var(--gov-mist)] text-[var(--gov-blue)] shadow-none">
                                            {getStatusLabel(
                                                activity.status,
                                                locale,
                                            )}
                                        </Badge>
                                        <Megaphone className="h-4 w-4 text-[var(--gov-blue)]" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-[var(--gov-navy-strong)]">
                                        {translation.title ??
                                            t(locale, 'activities.title')}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                        {translation.description ??
                                            t(locale, 'common.noData')}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="gov-container py-16">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="gov-kicker mb-3">Services</p>
                            <h2 className="gov-section-title">
                                Quick access to public services
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-3">
                        {serviceCards.map((card) => (
                            <Link
                                key={card.href}
                                href={publicHref(card.href)}
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
                                    Open section
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[var(--gov-surface)]">
                <div className="gov-container py-16">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="gov-kicker mb-3">
                                {t(locale, 'news.whatsNew')}
                            </p>
                            <h2 className="gov-section-title">
                                {t(locale, 'news.whatsNewDescription')}
                            </h2>
                        </div>
                        <Link
                            href={publicHref('/news')}
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
                                    className="gov-panel overflow-hidden p-5"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            {item.is_featured && (
                                                <Badge className="rounded-full bg-[var(--gov-blue)] text-white shadow-none">
                                                    {t(locale, 'news.featured')}
                                                </Badge>
                                            )}
                                            {isRecent(item.published_at) && (
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 shadow-none"
                                                >
                                                    {t(locale, 'news.new')}
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {formatLocalizedDate(
                                                item.published_at,
                                                locale,
                                            )}
                                        </span>
                                    </div>

                                    <h3 className="mt-5 text-lg font-semibold text-[var(--gov-navy-strong)]">
                                        {translation.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                        {translation.summary}
                                    </p>
                                    <Link
                                        href={publicHref(`/news/${item.slug}`)}
                                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--gov-blue)]"
                                    >
                                        {t(locale, 'common.readMore')}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="gov-container py-16">
                    <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
                        <div className="gov-panel p-7">
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
                                    href={publicHref('/procurement')}
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
                                            className="rounded-2xl border border-[var(--gov-line)] bg-[var(--gov-surface)] p-4"
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
                                                <Badge className="rounded-full bg-[var(--gov-mist)] text-[var(--gov-blue)] shadow-none">
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

                        <div className="rounded-[2rem] bg-[linear-gradient(180deg,var(--gov-forest-soft)_0%,var(--gov-forest-deep)_100%)] p-8 text-white shadow-[0_24px_60px_-30px_rgba(8,61,46,0.55)]">
                            <p className="text-sm font-semibold tracking-[0.22em] text-[var(--gov-gold)] uppercase">
                                GRM Service
                            </p>
                            <h2 className="mt-3 text-3xl font-semibold">
                                {t(locale, 'grm.title')}
                            </h2>
                            <p className="mt-4 max-w-lg text-sm leading-7 text-white/76">
                                {t(locale, 'grm.description')}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    className="rounded-full bg-[var(--gov-gold)] text-white hover:bg-[#e0a53a]"
                                >
                                    <Link href={publicHref('/grm/submit')}>
                                        {t(locale, 'grm.submit')}
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-white/20 bg-transparent text-white hover:bg-white hover:text-[var(--gov-forest-deep)]"
                                >
                                    <Link href={publicHref('/grm/track')}>
                                        {t(locale, 'grm.track')}
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-white/6 p-5">
                                    <p className="text-sm font-medium text-white/60">
                                        {t(locale, 'home.documents')}
                                    </p>
                                    <p className="mt-2 text-3xl font-semibold">
                                        {latestDocuments.length}+
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/6 p-5">
                                    <p className="text-sm font-medium text-white/60">
                                        {t(locale, 'home.activities')}
                                    </p>
                                    <p className="mt-2 text-3xl font-semibold">
                                        {activities.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

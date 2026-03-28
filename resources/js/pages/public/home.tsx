import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    FileText,
    HelpCircle,
    Megaphone,
    MessageSquare,
    ShoppingBag,
} from 'lucide-react';

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
    const serviceCards = [
        {
            title: t(locale, 'home.services.activitiesTitle'),
            description: t(locale, 'home.services.activitiesDescription'),
            href: '/activities',
            icon: Megaphone,
        },
        {
            title: t(locale, 'home.services.procurementTitle'),
            description: t(locale, 'home.services.procurementDescription'),
            href: '/procurement',
            icon: ShoppingBag,
        },
        {
            title: t(locale, 'home.services.documentsTitle'),
            description: t(locale, 'home.services.documentsDescription'),
            href: '/documents',
            icon: FileText,
        },
    ];
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
                            <p className="gov-kicker mb-5 text-[var(--public-accent)]">
                                {t(locale, 'home.title')}
                            </p>
                            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                                {t(locale, 'home.heroTitle')}
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                                {t(locale, 'home.heroDescription')}
                            </p>

                            <div className="mt-9 flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    size="lg"
                                    className="rounded-md bg-(--public-primary) px-6 text-white hover:bg-(--public-primary-hover)"
                                >
                                    <Link href={publicHref('/activities')}>
                                        {t(locale, 'home.learnMore')}
                                    </Link>
                                </Button>
                                <Link
                                    href={publicHref('/contact')}
                                    className="gov-pill-link"
                                >
                                    {t(locale, 'home.contactAction')}
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-4xl border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="gov-stat-card bg-white/95">
                                    <p className="text-xs font-medium tracking-[0.22em] text-(--public-accent) uppercase">
                                        {t(locale, 'home.keyFocus')}
                                    </p>
                                    <p className="mt-3 text-4xl font-semibold text-(--public-primary-hover)">
                                        10+
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {t(locale, 'home.keyFocusCaption')}
                                    </p>
                                </div>
                                <div className="gov-stat-card bg-white/95">
                                    <p className="text-xs font-medium tracking-[0.22em] text-[var(--public-accent)] uppercase">
                                        {t(locale, 'home.budget')}
                                    </p>
                                    <p className="mt-3 text-4xl font-semibold text-[var(--public-primary-hover)]">
                                        $40M
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {t(locale, 'home.budgetCaption')}
                                    </p>
                                </div>
                                <div className="gov-stat-card bg-white/95">
                                    <p className="text-xs font-medium tracking-[0.22em] text-[var(--public-accent)] uppercase">
                                        {t(locale, 'home.activities')}
                                    </p>
                                    <p className="mt-3 text-4xl font-semibold text-[var(--public-primary-hover)]">
                                        {activities.length}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {t(locale, 'home.activitiesCaption')}
                                    </p>
                                </div>
                                <div className="gov-stat-card bg-white/95">
                                    <p className="text-xs font-medium tracking-[0.22em] text-[var(--public-accent)] uppercase">
                                        {t(locale, 'home.documents')}
                                    </p>
                                    <p className="mt-3 text-4xl font-semibold text-[var(--public-primary-hover)]">
                                        {latestDocuments.length}+
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {t(locale, 'home.documentsCaption')}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-2xl border border-white/10 bg-white/8 px-5 py-4 text-sm text-white/78">
                                {t(locale, 'home.contactLabel')}:{' '}
                                {settings.contact_email ?? 'info@example.tj'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                            <p className="text-3xl font-semibold text-[var(--public-accent)]">
                                30+
                            </p>
                            <p className="mt-2 text-sm text-white/66">
                                {t(locale, 'home.metrics.contentUnits')}
                            </p>
                        </div>
                        <div>
                            <p className="text-3xl font-semibold text-[var(--public-accent)]">
                                200+
                            </p>
                            <p className="mt-2 text-sm text-white/66">
                                {t(locale, 'home.metrics.interactions')}
                            </p>
                        </div>
                        <div>
                            <p className="text-3xl font-semibold text-[var(--public-accent)]">
                                50+
                            </p>
                            <p className="mt-2 text-sm text-white/66">
                                {t(locale, 'home.metrics.materials')}
                            </p>
                        </div>
                        <div>
                            <p className="text-3xl font-semibold text-[var(--public-accent)]">
                                15+
                            </p>
                            <p className="mt-2 text-sm text-white/66">
                                {t(locale, 'home.metrics.workstreams')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick access band */}
            <section className="border-b border-[var(--public-border)] bg-white">
                <div className="gov-container py-6">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            {
                                icon: FileText,
                                labelKey: 'home.services.documentsTitle',
                                href: '/documents',
                            },
                            {
                                icon: ShoppingBag,
                                labelKey: 'home.services.procurementTitle',
                                href: '/procurement',
                            },
                            {
                                icon: MessageSquare,
                                labelKey: 'grm.submit',
                                href: '/grm/submit',
                            },
                            {
                                icon: HelpCircle,
                                labelKey: 'nav.contact',
                                href: '/contact',
                            },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={publicHref(item.href)}
                                className="flex items-center gap-3 rounded-xl border border-[var(--public-border)] bg-[var(--public-surface)] px-4 py-3 text-sm font-medium text-[var(--public-primary)] transition hover:border-[var(--public-accent)]/30 hover:bg-[var(--public-accent)]/5 hover:text-[var(--public-accent)]"
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {t(locale, item.labelKey)}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[var(--public-surface)]">
                <div className="gov-container py-16">
                    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                        <div>
                            <p className="gov-kicker mb-4">
                                {t(locale, 'home.mission')}
                            </p>
                            <h2 className="gov-section-title">
                                {t(locale, 'home.missionTitle')}
                            </h2>
                            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-600">
                                {settings.site_description ??
                                    t(locale, 'home.missionFallback')}
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={publicHref('/activities')}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--public-accent)]"
                                >
                                    {t(locale, 'home.learnMore')}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="gov-stat-card">
                                <p className="text-3xl font-semibold text-[var(--public-primary-hover)]">
                                    30+
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    {t(locale, 'home.publicContentAreas')}
                                </p>
                            </div>
                            <div className="gov-stat-card">
                                <p className="text-3xl font-semibold text-[var(--public-primary-hover)]">
                                    200+
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    {t(
                                        locale,
                                        'home.visibleOperationalRecords',
                                    )}
                                </p>
                            </div>
                            <div className="gov-stat-card">
                                <p className="text-3xl font-semibold text-[var(--public-primary-hover)]">
                                    50+
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    {t(
                                        locale,
                                        'home.publishedReferenceMaterials',
                                    )}
                                </p>
                            </div>
                            <div className="gov-stat-card">
                                <p className="text-3xl font-semibold text-[var(--public-primary-hover)]">
                                    15+
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    {t(
                                        locale,
                                        'home.currentImplementationPriorities',
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="gov-soft-section border-y border-[var(--public-border)]">
                <div className="gov-container py-16">
                    <div className="mb-8">
                        <p className="gov-kicker mb-3">
                            {t(locale, 'home.activities')}
                        </p>
                        <h2 className="gov-section-title">
                            {t(locale, 'home.activitiesSectionTitle')}
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
                                        <Badge className="rounded-md bg-[var(--public-surface-alt)] text-[var(--public-accent)] shadow-none">
                                            {getStatusLabel(
                                                activity.status,
                                                locale,
                                            )}
                                        </Badge>
                                        <Megaphone className="h-4 w-4 text-[var(--public-accent)]" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-[var(--public-primary-hover)]">
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
                            <p className="gov-kicker mb-3">
                                {t(locale, 'home.services')}
                            </p>
                            <h2 className="gov-section-title">
                                {t(locale, 'home.servicesTitle')}
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
                                <card.icon className="h-6 w-6 text-[var(--public-accent)]" />
                                <h3 className="mt-5 text-xl font-semibold text-[var(--public-primary-hover)]">
                                    {card.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {card.description}
                                </p>
                                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--public-accent)]">
                                    {t(locale, 'home.servicesOpenSection')}
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[var(--public-surface)]">
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
                            className="text-sm font-medium text-[var(--public-accent)] hover:text-[var(--public-primary)]"
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
                                                <Badge className="rounded-md bg-[var(--public-accent)] text-white shadow-none">
                                                    {t(locale, 'news.featured')}
                                                </Badge>
                                            )}
                                            {isRecent(item.published_at) && (
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-md border-emerald-200 bg-emerald-50 text-emerald-700 shadow-none"
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

                                    <h3 className="mt-5 text-lg font-semibold text-[var(--public-primary-hover)]">
                                        {translation.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                        {translation.summary}
                                    </p>
                                    <Link
                                        href={publicHref(`/news/${item.slug}`)}
                                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--public-accent)]"
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
                                        {t(locale, 'home.procurement')}
                                    </p>
                                    <h2 className="text-2xl font-semibold text-[var(--public-primary-hover)]">
                                        {t(locale, 'home.openNotices')}
                                    </h2>
                                </div>
                                <Link
                                    href={publicHref('/procurement')}
                                    className="text-sm font-medium text-[var(--public-accent)]"
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
                                            className="rounded-2xl border border-[var(--public-border)] bg-[var(--public-surface)] p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs font-medium tracking-[0.16em] text-slate-400 uppercase">
                                                        {item.reference_number}
                                                    </p>
                                                    <h3 className="mt-2 text-lg font-semibold text-[var(--public-primary-hover)]">
                                                        {translation.title ??
                                                            t(
                                                                locale,
                                                                'common.untitled',
                                                            )}
                                                    </h3>
                                                </div>
                                                <Badge className="rounded-md bg-[var(--public-surface-alt)] text-[var(--public-accent)] shadow-none">
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

                        <div className="rounded-[2rem] bg-[linear-gradient(180deg,var(--public-primary)_0%,var(--public-primary-hover)_100%)] p-8 text-white shadow-[0_24px_60px_-30px_rgba(22,50,79,0.45)]">
                            <p className="text-sm font-semibold tracking-[0.22em] text-[var(--public-accent)] uppercase">
                                {t(locale, 'home.grmService')}
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
                                    className="rounded-md bg-[var(--public-accent)] text-white hover:bg-[var(--public-accent-hover)]"
                                >
                                    <Link href={publicHref('/grm/submit')}>
                                        {t(locale, 'grm.submit')}
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-md border-white/20 bg-transparent text-white hover:bg-white hover:text-[var(--public-primary-hover)]"
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

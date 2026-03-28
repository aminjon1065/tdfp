import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    FileText,
    HelpCircle,
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
                                className="rounded-md bg-white px-6 text-[var(--public-primary)] hover:bg-white/90"
                            >
                                <Link href={publicHref('/activities')}>
                                    {t(locale, 'home.learnMore')}
                                </Link>
                            </Button>
                            <Link
                                href={publicHref('/grm/submit')}
                                className="gov-pill-link"
                            >
                                {t(locale, 'home.contactAction')}
                            </Link>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-3 gap-px border-t border-white/10 pt-6 text-sm text-white/60">
                        <span className="flex flex-col gap-0.5 pr-4">
                            <span className="text-xl font-bold text-white">$39.7M</span>
                            {t(locale, 'home.budgetCaption')}
                        </span>
                        <span className="flex flex-col gap-0.5 border-x border-white/10 px-4">
                            <span className="text-xl font-bold text-white">2024–2030</span>
                            {t(locale, 'project.period')}
                        </span>
                        {activities.length > 0 && (
                            <span className="flex flex-col gap-0.5 pl-4">
                                <span className="text-xl font-bold text-white">{activities.length}</span>
                                {t(locale, 'home.activitiesCaption')}
                            </span>
                        )}
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

            {/* Project Components & Financing */}
            <section className="bg-[var(--public-surface)]">
                <div className="gov-container py-16">
                    <div className="mb-8">
                        <p className="gov-kicker mb-3">
                            {t(locale, 'home.projectComponentsTitle')}
                        </p>
                        <h2 className="gov-section-title">
                            {t(locale, 'project.financingSources')}
                        </h2>
                    </div>
                    <div className="grid gap-5 lg:grid-cols-3">
                        {[
                            {
                                number: '1',
                                titleKey: 'home.component1.title',
                                descKey: 'home.component1.desc',
                                amount: '$24.7M',
                                href: '/activities?domain=digital-infrastructure',
                            },
                            {
                                number: '2',
                                titleKey: 'home.component2.title',
                                descKey: 'home.component2.desc',
                                amount: '$20.8M',
                                href: '/activities?domain=digital-skills',
                            },
                            {
                                number: '3',
                                titleKey: 'home.component3.title',
                                descKey: 'home.component3.desc',
                                amount: '$5.7M',
                                href: '/project',
                            },
                        ].map((comp) => (
                            <Link
                                key={comp.number}
                                href={publicHref(comp.href)}
                                className="gov-panel group p-6 transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                                    {t(locale, 'home.projectComponents')} {comp.number}
                                </p>
                                <h3 className="mt-3 text-lg font-semibold text-[var(--public-primary-hover)]">
                                    {t(locale, comp.titleKey)}
                                </h3>
                                <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">
                                    {t(locale, comp.descKey)}
                                </p>
                                <p className="mt-4 text-2xl font-bold text-[var(--public-accent)]">
                                    {comp.amount}
                                </p>
                                <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--public-accent)]">
                                    {t(locale, 'common.learnMore')}
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4 text-right">
                        <Link
                            href={publicHref('/project')}
                            className="text-sm font-medium text-[var(--public-accent)] hover:text-[var(--public-primary)]"
                        >
                            {t(locale, 'nav.theProject')} →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Activities by Domain */}
            <section className="gov-soft-section border-y border-[var(--public-border)]">
                <div className="gov-container py-16">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="gov-kicker mb-3">
                                {t(locale, 'home.domainTilesTitle')}
                            </p>
                            <h2 className="gov-section-title">
                                {t(locale, 'home.domainTilesSubtitle')}
                            </h2>
                        </div>
                        <Link
                            href={publicHref('/activities')}
                            className="text-sm font-medium text-[var(--public-accent)] hover:text-[var(--public-primary)]"
                        >
                            {t(locale, 'nav.viewAllActivities')}
                        </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { slug: 'digital-infrastructure', labelKey: 'nav.domain1', color: 'bg-slate-100 text-slate-700 border-slate-200' },
                            { slug: 'digital-public-services', labelKey: 'nav.domain2', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                            { slug: 'digital-identity-payments', labelKey: 'nav.domain3', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                            { slug: 'cybersecurity', labelKey: 'nav.domain4', color: 'bg-red-50 text-red-700 border-red-200' },
                            { slug: 'legal-governance', labelKey: 'nav.domain5', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                            { slug: 'digital-skills', labelKey: 'nav.domain6', color: 'bg-green-50 text-green-700 border-green-200' },
                            { slug: 'school-connectivity', labelKey: 'nav.domain7', color: 'bg-teal-50 text-teal-700 border-teal-200' },
                        ].map((domain) => {
                            const count = (activities as any[]).filter((a: any) => a.domain_slug === domain.slug).length;
                            return (
                                <Link
                                    key={domain.slug}
                                    href={publicHref(`/activities?domain=${domain.slug}`)}
                                    className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${domain.color}`}
                                >
                                    <p className="text-sm font-semibold leading-snug">
                                        {t(locale, domain.labelKey)}
                                    </p>
                                    <p className="mt-3 text-2xl font-bold">
                                        {count}
                                    </p>
                                    <p className="mt-0.5 text-xs opacity-70">
                                        {t(locale, 'home.activitiesCount')}
                                    </p>
                                </Link>
                            );
                        })}
                        <Link
                            href={publicHref('/activities')}
                            className="flex items-center justify-center rounded-2xl border border-dashed border-[var(--public-border)] p-5 text-sm font-medium text-[var(--public-accent)] transition hover:border-[var(--public-accent)]/50 hover:bg-[var(--public-accent)]/5"
                        >
                            {t(locale, 'nav.viewAllActivities')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
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

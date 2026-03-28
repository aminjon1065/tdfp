import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    ChevronRight,
    ExternalLink,
    FileText,
    Globe,
    Landmark,
    TrendingUp,
} from 'lucide-react';

import PageHero from '@/components/page-hero';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';

interface DocumentItem {
    id: number;
    translations?: { language: string; title?: string }[];
}

interface Props {
    slug: string;
    projectDocuments: DocumentItem[];
}

const TABS = [
    { id: 'overview', labelKey: 'project.pdo' },
    { id: 'components', labelKey: 'home.projectComponentsTitle' },
    { id: 'timeline', labelKey: 'project.timeline' },
    { id: 'results', labelKey: 'project.results' },
    { id: 'documents', labelKey: 'project.relatedDocuments' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ProjectShow({ projectDocuments }: Props) {
    const sharedPage = usePage().props as any;
    const locale = sharedPage.locale ?? 'en';
    const defaultLocale = sharedPage.localization?.default_locale ?? 'en';
    const publicHref = (path: string) =>
        localizedPublicHref(path, locale, defaultLocale);

    const [activeTab, setActiveTab] = useState<TabId>('overview');

    const components = [
        {
            number: '1',
            titleKey: 'project.component1' as const,
            amount: '$24.7M',
            sub: [
                { titleKey: 'project.component1.sub1' as const, amount: '$21.4M' },
                { titleKey: 'project.component1.sub2' as const, amount: '$3.3M' },
            ],
        },
        {
            number: '2',
            titleKey: 'project.component2' as const,
            amount: '$20.8M',
            sub: [],
        },
        {
            number: '3',
            titleKey: 'project.component3' as const,
            amount: '$5.7M',
            sub: [],
        },
    ];

    const timeline = [
        { date: 'May 2025', noteKey: 'project.timeline.step1' as const },
        { date: 'Q1 2025',  noteKey: 'project.timeline.step2' as const },
        { date: '2025–2027', noteKey: 'project.timeline.step3' as const },
        { date: '2028–2030', noteKey: 'project.timeline.step4' as const },
        { date: 'Dec 2030', noteKey: 'project.timeline.step5' as const },
    ];

    return (
        <PublicLayout
            title={t(locale, 'project.title')}
            description={t(locale, 'project.pdoText')}
            seoType="website"
            blendHeader
        >
            {/* Hero */}
            <PageHero
                title={t(locale, 'project.title')}
                subtitle={t(locale, 'project.worldBankRef')}
                compact
            >
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-1 text-xs text-blue-200"
                >
                    <Link
                        href={publicHref('/')}
                        className="transition-colors hover:text-white"
                    >
                        {t(locale, 'common.home')}
                    </Link>
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                    <Link
                        href={publicHref('/projects')}
                        className="transition-colors hover:text-white"
                    >
                        {t(locale, 'nav.projects')}
                    </Link>
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                    <span className="text-white" aria-current="page">
                        {t(locale, 'project.title')}
                    </span>
                </nav>
            </PageHero>

            {/* Status + stats strip */}
            <div className="border-b border-[var(--public-border)] bg-white">
                <div className="gov-container py-5">
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {t(locale, 'project.statusActive')}
                        </span>
                        <span className="text-xs text-slate-400">
                            {t(locale, 'project.worldBankRef')}
                        </span>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                        {[
                            {
                                icon: Calendar,
                                labelKey: 'project.approvalDate',
                                value: formatLocalizedDate('2025-05-08', locale),
                            },
                            {
                                icon: Calendar,
                                labelKey: 'project.closingDate',
                                value: formatLocalizedDate('2030-12-31', locale),
                            },
                            {
                                icon: Landmark,
                                labelKey: 'project.totalFinancing',
                                value: '$45.4M',
                            },
                            {
                                icon: Building2,
                                labelKey: 'project.implementingAgency',
                                value: t(locale, 'site.center'),
                            },
                        ].map(({ icon: Icon, labelKey, value }) => (
                            <div
                                key={labelKey}
                                className="flex items-start gap-3"
                            >
                                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--public-accent)]" />
                                <div>
                                    <dt className="text-xs font-medium tracking-[0.14em] text-slate-400 uppercase">
                                        {t(locale, labelKey)}
                                    </dt>
                                    <dd className="mt-0.5 text-sm font-semibold text-[var(--public-primary-hover)]">
                                        {value}
                                    </dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            {/* Tab bar */}
            <div className="sticky top-[57px] z-20 border-b border-[var(--public-border)] bg-white/95 backdrop-blur-sm">
                <div className="gov-container">
                    <nav
                        className="flex gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        aria-label="Project sections"
                    >
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`shrink-0 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-[var(--public-accent)] text-[var(--public-accent)]'
                                        : 'border-transparent text-slate-500 hover:text-[var(--public-primary)]'
                                }`}
                            >
                                {t(locale, tab.labelKey)}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content + sidebar */}
            <div className="gov-container py-12">
                <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
                    {/* Tab content */}
                    <div>
                        {/* Overview */}
                        {activeTab === 'overview' && (
                            <section className="space-y-8">
                                <div>
                                    <p className="gov-kicker mb-3">
                                        {t(locale, 'project.pdo')}
                                    </p>
                                    <blockquote className="border-l-4 border-[var(--public-accent)] pl-6">
                                        <p className="text-xl leading-9 font-medium text-[var(--public-primary-hover)]">
                                            {t(locale, 'project.pdoText')}
                                        </p>
                                        <footer className="mt-3 text-xs text-slate-400">
                                            {t(locale, 'project.pdoSource')}
                                        </footer>
                                    </blockquote>
                                </div>
                                <div className="rounded-2xl border border-[var(--public-border)] bg-[var(--public-surface)] p-6 text-sm leading-8 text-slate-600">
                                    {t(locale, 'project.overview')}
                                </div>
                            </section>
                        )}

                        {/* Components & Financing */}
                        {activeTab === 'components' && (
                            <section>
                                <p className="gov-kicker mb-3">
                                    {t(locale, 'home.projectComponentsTitle')}
                                </p>
                                <h2 className="gov-section-title mb-6">
                                    {t(locale, 'project.financingSources')}
                                </h2>
                                <div className="overflow-hidden rounded-2xl border border-[var(--public-border)]">
                                    <table className="w-full text-sm">
                                        <thead className="bg-[var(--public-surface)] text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
                                            <tr>
                                                <th className="px-6 py-3 text-left">
                                                    {t(locale, 'project.componentLabel')}
                                                </th>
                                                <th className="px-6 py-3 text-right">
                                                    {t(locale, 'project.financing')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--public-border)] bg-white">
                                            {components.map((comp) => (
                                                <React.Fragment key={comp.number}>
                                                    <tr className="font-medium">
                                                        <td className="px-6 py-4 text-[var(--public-primary-hover)]">
                                                            <span className="mr-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                                                {t(locale, 'home.projectComponents')}{' '}
                                                                {comp.number}
                                                            </span>
                                                            {t(locale, comp.titleKey)}
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-semibold text-[var(--public-primary-hover)]">
                                                            {comp.amount}
                                                        </td>
                                                    </tr>
                                                    {comp.sub.map((sub) => (
                                                        <tr key={sub.titleKey} className="bg-slate-50/60">
                                                            <td className="px-6 py-3 pl-10 text-slate-500">
                                                                ↳ {t(locale, sub.titleKey)}
                                                            </td>
                                                            <td className="px-6 py-3 text-right text-slate-500">
                                                                {sub.amount}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                            <tr className="bg-[var(--public-primary-hover)] font-bold text-white">
                                                <td className="px-6 py-4">
                                                    {t(locale, 'project.totalFinancing')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    $51.2M
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-3 text-xs text-slate-400">
                                    {t(locale, 'project.financingNote')}
                                </p>
                            </section>
                        )}

                        {/* Timeline */}
                        {activeTab === 'timeline' && (
                            <section>
                                <p className="gov-kicker mb-6">
                                    {t(locale, 'project.timeline')}
                                </p>
                                <ol className="relative space-y-0">
                                    {timeline.map((step, index) => (
                                        <li key={index} className="flex gap-5">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${
                                                        index === 0 || index === 1
                                                            ? 'bg-emerald-500'
                                                            : 'bg-[var(--public-accent)]'
                                                    }`}
                                                >
                                                    {index + 1}
                                                </div>
                                                {index < timeline.length - 1 && (
                                                    <div
                                                        className="mt-1 w-px flex-1 bg-[var(--public-border)]"
                                                        style={{ minHeight: '2.5rem' }}
                                                    />
                                                )}
                                            </div>
                                            <div className="pb-8">
                                                <p className="text-xs font-semibold tracking-[0.14em] text-[var(--public-accent)] uppercase">
                                                    {step.date}
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-[var(--public-primary-hover)]">
                                                    {t(locale, step.noteKey)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        )}

                        {/* Results */}
                        {activeTab === 'results' && (
                            <section>
                                <p className="gov-kicker mb-6">
                                    {t(locale, 'project.results')}
                                </p>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {[
                                        {
                                            labelKey: 'project.indicator1',
                                            value: '25',
                                            targetKey: 'project.indicator1.target',
                                        },
                                        {
                                            labelKey: 'project.indicator2',
                                            value: '28,000',
                                            targetKey: 'project.indicator2.target',
                                        },
                                    ].map(({ labelKey, value, targetKey }) => (
                                        <div key={labelKey} className="gov-panel p-6">
                                            <p className="flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-slate-400 uppercase">
                                                <TrendingUp className="h-3.5 w-3.5 text-[var(--public-accent)]" />
                                                {t(locale, labelKey)}
                                            </p>
                                            <p className="mt-4 text-5xl font-bold text-[var(--public-primary-hover)]">
                                                {value}
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                                {t(locale, targetKey)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Documents */}
                        {activeTab === 'documents' && (
                            <section>
                                <p className="gov-kicker mb-3">
                                    {t(locale, 'project.relatedDocuments')}
                                </p>
                                {projectDocuments.length > 0 ? (
                                    <ul className="divide-y divide-[var(--public-border)] overflow-hidden rounded-2xl border border-[var(--public-border)] bg-white">
                                        {projectDocuments.map((doc) => {
                                            const translation = getTranslation(doc, locale);
                                            return (
                                                <li key={doc.id}>
                                                    <Link
                                                        href={publicHref(`/documents/${doc.id}/download`)}
                                                        className="flex items-center justify-between gap-4 px-5 py-4 text-sm transition-colors hover:bg-slate-50"
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <FileText className="h-4 w-4 shrink-0 text-[var(--public-accent)]" />
                                                            <span className="font-medium text-[var(--public-primary-hover)]">
                                                                {translation.title ?? t(locale, 'common.untitled')}
                                                            </span>
                                                        </span>
                                                        <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="rounded-2xl border border-dashed border-[var(--public-border)] py-10 text-center text-sm text-slate-400">
                                        {t(locale, 'common.noData')}
                                    </p>
                                )}
                                <div className="mt-4">
                                    <Link
                                        href={publicHref('/documents')}
                                        className="text-sm font-medium text-[var(--public-accent)] hover:text-[var(--public-primary)]"
                                    >
                                        {t(locale, 'common.viewAll')} {t(locale, 'nav.documents')} →
                                    </Link>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-5">
                        {/* Key facts card */}
                        <div className="overflow-hidden rounded-2xl border border-[var(--public-border)] bg-white">
                            <div className="bg-[var(--public-primary-hover)] px-5 py-4">
                                <p className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
                                    {t(locale, 'project.worldBankRef')}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-white">
                                    {t(locale, 'project.title')}
                                </p>
                            </div>
                            <dl className="divide-y divide-[var(--public-border)]">
                                {[
                                    { labelKey: 'project.approvalDate', value: 'May 8, 2025' },
                                    { labelKey: 'project.closingDate', value: 'Dec 31, 2030' },
                                    { labelKey: 'project.totalFinancing', value: '$45.4M' },
                                    { labelKey: 'project.idaCredit', value: '$30M' },
                                    { labelKey: 'project.sdcGrant', value: '$9M' },
                                    { labelKey: 'project.privateFinancing', value: '$5M' },
                                    { labelKey: 'project.govContribution', value: '$1.4M' },
                                    { labelKey: 'project.implementingAgency', value: t(locale, 'site.center') },
                                ].map(({ labelKey, value }) => (
                                    <div key={labelKey} className="grid grid-cols-[1fr_auto] gap-2 px-5 py-3">
                                        <dt className="text-xs text-slate-400">
                                            {t(locale, labelKey)}
                                        </dt>
                                        <dd className="text-right text-xs font-semibold text-[var(--public-primary-hover)]">
                                            {value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Partners card */}
                        <div className="rounded-2xl border border-[var(--public-border)] bg-[var(--public-surface)] p-5">
                            <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">
                                {t(locale, 'footer.partners')}
                            </p>
                            <div className="space-y-3">
                                <a
                                    href="https://projects.worldbank.org/en/projects-operations/project-detail/P506611"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between rounded-xl border border-[var(--public-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--public-primary-hover)] transition hover:border-[var(--public-accent)]/30 hover:text-[var(--public-accent)]"
                                >
                                    <span className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-[var(--public-accent)]" />
                                        World Bank · P506611
                                    </span>
                                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                                </a>
                                <div className="flex items-center gap-2 rounded-xl border border-[var(--public-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--public-primary-hover)]">
                                    <Globe className="h-4 w-4 text-[var(--public-accent)]" />
                                    SDC Switzerland
                                </div>
                            </div>
                        </div>

                        {/* GRM quick link */}
                        <Link
                            href={publicHref('/grm/submit')}
                            className="flex items-center justify-between rounded-2xl bg-[var(--public-primary-hover)] px-5 py-4 text-sm font-medium text-white transition hover:opacity-90"
                        >
                            <span>{t(locale, 'grm.submit')}</span>
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    );
}

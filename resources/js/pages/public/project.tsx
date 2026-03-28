import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, ExternalLink } from 'lucide-react';

import PageHero from '@/components/page-hero';
import PublicLayout from '@/layouts/public-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';

interface DocumentItem {
    id: number;
    slug?: string;
    translations?: { language: string; title?: string }[];
    published_at?: string | null;
}

interface Props {
    projectDocuments: DocumentItem[];
}

export default function Project({ projectDocuments }: Props) {
    const sharedPage = usePage().props as any;
    const locale = sharedPage.locale ?? 'en';
    const defaultLocale = sharedPage.localization?.default_locale ?? 'en';
    const publicHref = (path: string) =>
        localizedPublicHref(path, locale, defaultLocale);

    const components = [
        {
            number: '1',
            titleKey: 'project.component1',
            amount: '$24.7M',
            sub: [
                { titleKey: 'project.component1.sub1', amount: '$21.4M' },
                { titleKey: 'project.component1.sub2', amount: '$3.3M' },
            ],
        },
        {
            number: '2',
            titleKey: 'project.component2',
            amount: '$20.8M',
            sub: [],
        },
        {
            number: '3',
            titleKey: 'project.component3',
            amount: '$5.7M',
            sub: [],
        },
    ];

    const timeline = [
        { date: 'Dec 2024', labelKey: 'project.approvalDate', note: 'World Bank Board approval' },
        { date: 'Q1 2025', labelKey: 'project.implementingAgency', note: 'PIC established, teams recruited' },
        { date: '2025–2027', labelKey: 'nav.domain1', note: 'Phase 1 — infrastructure & services' },
        { date: '2028–2030', labelKey: 'nav.domain6', note: 'Phase 2 — skills & school connectivity' },
        { date: 'Dec 2030', labelKey: 'project.closingDate', note: 'Project closing' },
    ];

    return (
        <PublicLayout
            title={t(locale, 'project.title')}
            description={t(locale, 'project.pdoText')}
            seoType="website"
            blendHeader
        >
            <PageHero
                title={t(locale, 'project.title')}
                subtitle={t(locale, 'project.worldBankRef')}
                description={t(locale, 'project.pdoText')}
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
                    <span className="text-white" aria-current="page">
                        {t(locale, 'nav.theProject')}
                    </span>
                </nav>
            </PageHero>

            {/* Key facts strip */}
            <div className="border-b border-[var(--public-border)] bg-white">
                <div className="gov-container py-5">
                    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                            <dt className="text-xs font-medium tracking-[0.16em] text-slate-400 uppercase">
                                {t(locale, 'project.approvalDate')}
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-[var(--public-primary-hover)]">
                                December 17, 2024
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium tracking-[0.16em] text-slate-400 uppercase">
                                {t(locale, 'project.closingDate')}
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-[var(--public-primary-hover)]">
                                December 13, 2030
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium tracking-[0.16em] text-slate-400 uppercase">
                                {t(locale, 'project.totalFinancing')}
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-[var(--public-primary-hover)]">
                                $39.7M
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium tracking-[0.16em] text-slate-400 uppercase">
                                {t(locale, 'project.implementingAgency')}
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-[var(--public-primary-hover)]">
                                {t(locale, 'site.center')}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="gov-container py-16 space-y-16">
                {/* PDO section */}
                <section>
                    <p className="gov-kicker mb-3">{t(locale, 'project.pdo')}</p>
                    <blockquote className="border-l-4 border-[var(--public-accent)] pl-6">
                        <p className="text-xl font-medium text-[var(--public-primary-hover)] leading-8">
                            {t(locale, 'project.pdoText')}
                        </p>
                        <footer className="mt-3 text-xs text-slate-400">
                            {t(locale, 'project.pdoSource')}
                        </footer>
                    </blockquote>
                </section>

                {/* Components & Financing */}
                <section>
                    <p className="gov-kicker mb-3">{t(locale, 'home.projectComponentsTitle')}</p>
                    <h2 className="gov-section-title mb-8">
                        {t(locale, 'project.financingSources')}
                    </h2>

                    <div className="overflow-hidden rounded-2xl border border-[var(--public-border)]">
                        <table className="w-full text-sm">
                            <thead className="bg-[var(--public-surface)] text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Component</th>
                                    <th className="px-6 py-3 text-right">Financing</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--public-border)] bg-white">
                                {components.map((comp) => (
                                    <React.Fragment key={comp.number}>
                                        <tr className="font-medium">
                                            <td className="px-6 py-4 text-[var(--public-primary-hover)]">
                                                {t(locale, comp.titleKey)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold text-[var(--public-primary-hover)]">
                                                {comp.amount}
                                            </td>
                                        </tr>
                                        {comp.sub.map((sub) => (
                                            <tr key={sub.titleKey} className="bg-slate-50/50">
                                                <td className="px-6 py-3 pl-10 text-slate-600">
                                                    {t(locale, sub.titleKey)}
                                                </td>
                                                <td className="px-6 py-3 text-right text-slate-600">
                                                    {sub.amount}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                                <tr className="bg-[var(--public-surface)] font-bold">
                                    <td className="px-6 py-4 text-[var(--public-primary-hover)]">
                                        {t(locale, 'project.totalFinancing')}
                                    </td>
                                    <td className="px-6 py-4 text-right text-[var(--public-primary-hover)]">
                                        $51.2M
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        {t(locale, 'project.financingSources')}
                    </p>
                </section>

                {/* Implementation Timeline */}
                <section>
                    <p className="gov-kicker mb-3">{t(locale, 'project.timeline')}</p>
                    <div className="relative">
                        <div className="absolute top-5 left-0 right-0 h-px bg-[var(--public-border)]" aria-hidden="true" />
                        <ol className="relative grid grid-cols-2 gap-6 sm:grid-cols-5">
                            {timeline.map((step, index) => (
                                <li key={index} className="flex flex-col items-center text-center">
                                    <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--public-accent)] text-xs font-bold text-white shadow-sm">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm font-semibold text-[var(--public-primary-hover)]">
                                        {step.date}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 leading-5">
                                        {step.note}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Results Framework */}
                <section>
                    <p className="gov-kicker mb-3">{t(locale, 'project.results')}</p>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="gov-panel p-6">
                            <p className="text-xs font-medium tracking-[0.14em] text-slate-400 uppercase">
                                {t(locale, 'project.indicator1')}
                            </p>
                            <p className="mt-3 text-4xl font-semibold text-[var(--public-primary-hover)]">
                                25
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                {t(locale, 'project.indicator1.target')}
                            </p>
                        </div>
                        <div className="gov-panel p-6">
                            <p className="text-xs font-medium tracking-[0.14em] text-slate-400 uppercase">
                                {t(locale, 'project.indicator2')}
                            </p>
                            <p className="mt-3 text-4xl font-semibold text-[var(--public-primary-hover)]">
                                28,000
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                {t(locale, 'project.indicator2.target')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related Documents */}
                {projectDocuments.length > 0 && (
                    <section>
                        <p className="gov-kicker mb-3">{t(locale, 'project.relatedDocuments')}</p>
                        <ul className="divide-y divide-[var(--public-border)] rounded-2xl border border-[var(--public-border)] bg-white overflow-hidden">
                            {projectDocuments.map((doc) => {
                                const translation = getTranslation(doc, locale);
                                return (
                                    <li key={doc.id}>
                                        <Link
                                            href={publicHref(`/documents/${doc.id}/download`)}
                                            className="flex items-center justify-between px-5 py-4 text-sm hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="font-medium text-[var(--public-primary-hover)]">
                                                {translation.title ?? t(locale, 'common.untitled')}
                                            </span>
                                            <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
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
        </PublicLayout>
    );
}

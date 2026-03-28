import { Head, Link, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    FileText,
    FolderKanban,
    MessageSquare,
    ShieldCheck,
    Users,
} from 'lucide-react';

import PageHero from '@/components/page-hero';
import SocialShare from '@/components/social-share';
import PublicLayout from '@/layouts/public-layout';
import { getTranslation, t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';

interface Props {
    page: {
        slug: string;
        status: string;
        translations: {
            language: string;
            title: string;
            content: string;
            meta_title?: string;
            meta_description?: string;
        }[];
    } | null;
}

const HIGHLIGHT_ICONS = [FolderKanban, FileText, MessageSquare, ShieldCheck];

export default function About({ page }: Props) {
    const sharedPage = usePage().props as any;
    const locale = sharedPage.locale ?? 'en';
    const defaultLocale = sharedPage.localization?.default_locale ?? 'en';
    const currentUrl = sharedPage.ziggy?.location ?? '';
    const publicHref = (path: string) =>
        localizedPublicHref(path, locale, defaultLocale);
    const pageTranslation = page ? getTranslation(page, locale) : {};
    const pageTitle =
        (pageTranslation as any).meta_title ??
        (pageTranslation as any).title ??
        t(locale, 'nav.about');
    const pageDescription =
        (pageTranslation as any).meta_description ?? t(locale, 'about.mandate');

    const highlights = [1, 2, 3, 4].map((n, i) => ({
        titleKey: `about.highlight${n}.title` as const,
        descKey: `about.highlight${n}.description` as const,
        Icon: HIGHLIGHT_ICONS[i],
    }));

    return (
        <PublicLayout
            title={pageTitle}
            description={pageDescription}
            seoType="website"
            blendHeader
        >
            <Head title={`${pageTitle} | PIC TDFP`} />

            <PageHero
                title={t(locale, 'nav.about')}
                subtitle={t(locale, 'site.center')}
                description={t(locale, 'about.mandate')}
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
                        {t(locale, 'nav.about')}
                    </span>
                </nav>
            </PageHero>

            <section className="container mx-auto px-4 py-12">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    {/* Mandate block */}
                    <div className="rounded-3xl border border-[var(--public-border)] bg-white p-8 shadow-sm">
                        <p className="gov-kicker mb-3">{t(locale, 'nav.about')}</p>
                        <p className="text-base leading-8 text-slate-600">
                            {t(locale, 'about.mandate')}
                        </p>
                        <div className="mt-6">
                            <Link
                                href={publicHref('/team')}
                                className="inline-flex items-center gap-2 rounded-xl border border-[var(--public-border)] px-4 py-3 text-sm font-medium text-[var(--public-primary)] transition hover:border-[var(--public-accent)]/30 hover:text-[var(--public-accent)]"
                            >
                                <Users className="h-4 w-4 shrink-0" />
                                {t(locale, 'about.staffLink')}
                            </Link>
                        </div>
                    </div>

                    {/* Highlight cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {highlights.map(({ titleKey, descKey, Icon }) => (
                            <div
                                key={titleKey}
                                className="rounded-3xl border border-[var(--public-border)] bg-[var(--public-surface)] p-6"
                            >
                                <Icon className="h-5 w-5 text-[var(--public-accent)]" />
                                <h2 className="mt-4 text-lg font-semibold text-[var(--public-primary-hover)]">
                                    {t(locale, titleKey)}
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {t(locale, descKey)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CMS content (if any) */}
                {(pageTranslation as any).content && (
                    <article className="mt-10 rounded-3xl border border-[var(--public-border)] bg-white p-8 shadow-sm">
                        <div
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: (pageTranslation as any).content,
                            }}
                        />
                        <SocialShare
                            className="mt-8"
                            title={(pageTranslation as any).title ?? t(locale, 'nav.about')}
                            url={currentUrl}
                            description={pageDescription}
                        />
                    </article>
                )}

                {/* Partner acknowledgment */}
                <div className="mt-10 rounded-3xl border border-[var(--public-border)] bg-[var(--public-surface)] p-8">
                    <p className="gov-kicker mb-3">{t(locale, 'footer.partners')}</p>
                    <p className="text-sm leading-8 text-slate-600">
                        {t(locale, 'about.partnerAcknowledgment')}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4">
                        <span className="inline-flex items-center rounded-lg border border-[var(--public-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--public-primary-hover)]">
                            World Bank · IDA
                        </span>
                        <span className="inline-flex items-center rounded-lg border border-[var(--public-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--public-primary-hover)]">
                            SDC Switzerland
                        </span>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

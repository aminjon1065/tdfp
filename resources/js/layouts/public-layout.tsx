import type { PageProps } from '@inertiajs/core';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronRight,
    Mail,
    MapPin,
    Menu,
    Phone,
    X,
} from 'lucide-react';
import {
    type PropsWithChildren,
    type ReactElement,
    useEffect,
    useState,
} from 'react';

import { BVIButton } from '@/components/bvi/bvi-button';
import { BVIPanel } from '@/components/bvi/bvi-panel';
import NishonLogo from '@/components/nishon-logo';
import Seo from '@/components/seo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { getTranslation, t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';
import { cn } from '@/lib/utils';
import { useBVI } from '@/providers/bvi-provider';

const primaryNavLinks = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.about', href: '/about' },
    { key: 'nav.news', href: '/news' },
    { key: 'nav.procurement', href: '/procurement' },
    { key: 'nav.grm', href: '/grm' },
    { key: 'nav.contact', href: '/contact' },
];

const theProjectNavSections = [
    {
        key: 'nav.theProject',
        descriptionKey: 'nav.theProjectDescription',
        href: '/project',
    },
] as const;

const activitiesNavDomains = [
    { key: 'nav.domain1', slug: 'digital-infrastructure' },
    { key: 'nav.domain2', slug: 'digital-public-services' },
    { key: 'nav.domain3', slug: 'digital-identity-payments' },
    { key: 'nav.domain4', slug: 'cybersecurity' },
    { key: 'nav.domain5', slug: 'legal-governance' },
    { key: 'nav.domain6', slug: 'digital-skills' },
    { key: 'nav.domain7', slug: 'school-connectivity' },
] as const;

const projectNavSections = [
    {
        key: 'nav.projectActivities',
        descriptionKey: 'nav.projectActivitiesDescription',
        href: '/activities',
    },
    {
        key: 'nav.projectDocuments',
        descriptionKey: 'nav.projectDocumentsDescription',
        href: '/documents',
    },
    {
        key: 'nav.projectProcurement',
        descriptionKey: 'nav.projectProcurementDescription',
        href: '/procurement',
    },
] as const;

const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'tj', label: 'TJ' },
];

const hreflangMap: Record<string, string> = {
    en: 'en',
    ru: 'ru',
    tj: 'tg',
};

interface PublicLayoutProps extends PropsWithChildren {
    title?: string;
    description?: string;
    imageUrl?: string;
    structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
    seoType?: string;
    noIndex?: boolean;
    blendHeader?: boolean;
}

interface NavigationPageTranslation {
    language: string;
    title: string;
}

interface NavigationProjectPage {
    slug: string;
    href: string;
    translations?: NavigationPageTranslation[];
}

interface LayoutPageProps extends PageProps {
    locale?: string;
    localization?: {
        default_locale?: string;
        supported_locales?: string[];
    };
    ziggy?: {
        location?: string;
    };
    settings?: {
        contact_address?: string;
        contact_phone?: string;
        contact_email?: string;
    };
    siteSettings?: {
        site_title?: string;
        site_description?: string;
        contact_address?: string;
        contact_phone?: string;
        contact_email?: string;
        facebook_url?: string;
        twitter_url?: string;
        youtube_url?: string;
        analytics_enabled?: boolean;
        analytics_provider?: string;
        google_analytics_id?: string;
    };
    navigation?: {
        project_pages?: NavigationProjectPage[];
    };
}

export default function PublicLayout({
    children,
    title,
    description,
    imageUrl,
    structuredData,
    seoType,
    noIndex,
    blendHeader = false,
}: PublicLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { state: bviState } = useBVI();
    const inertiaPage = usePage<LayoutPageProps>();
    const page = inertiaPage.props;
    const currentLocale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const siteSettings = page.siteSettings ?? {};
    const pageUrl = inertiaPage.url || '/';
    const currentPath = new URL(pageUrl, 'https://tdfp.test').pathname;
    const siteTitle = siteSettings.site_title ?? 'PIC TDFP';
    const siteDescription = description ?? siteSettings.site_description;
    const projectPages = page.navigation?.project_pages ?? [];
    const projectNavLinks = [
        ...projectNavSections.map((section) => ({
            label: t(currentLocale, section.key),
            description: t(currentLocale, section.descriptionKey),
            href: publicHref(section.href),
        })),
        ...projectPages.map((projectPage) => ({
            label:
                getTranslation(projectPage, currentLocale).title ??
                projectPage.slug,
            description: t(currentLocale, 'nav.projectPageDescription'),
            href: publicHref(projectPage.href),
        })),
    ];
    const localeAlternates = currentUrl
        ? languages.map((language) => {
              const alternateUrl = new URL(currentUrl);

              if (language.code === defaultLocale) {
                  alternateUrl.searchParams.delete('lang');
              } else {
                  alternateUrl.searchParams.set('lang', language.code);
              }

              return {
                  hrefLang: hreflangMap[language.code] ?? language.code,
                  href: alternateUrl.toString(),
              };
          })
        : [];
    const defaultLocaleUrl = currentUrl
        ? (() => {
              const url = new URL(currentUrl);

              url.searchParams.delete('lang');

              return url.toString();
          })()
        : undefined;
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'GovernmentOrganization',
        name: siteTitle,
        url: currentUrl || undefined,
        email: siteSettings.contact_email || undefined,
        telephone: siteSettings.contact_phone || undefined,
        address: siteSettings.contact_address || undefined,
        sameAs: [
            siteSettings.facebook_url,
            siteSettings.twitter_url,
            siteSettings.youtube_url,
        ].filter(Boolean),
    };
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteTitle,
        url: currentUrl || undefined,
        description: siteSettings.site_description || undefined,
        inLanguage: currentLocale,
        potentialAction: currentUrl
            ? {
                  '@type': 'SearchAction',
                  target: `${new URL('/search', currentUrl).toString()}?q={search_term_string}`,
                  'query-input': 'required name=search_term_string',
              }
            : undefined,
    };
    const analyticsId = siteSettings.google_analytics_id?.trim();
    const analyticsEnabled =
        siteSettings.analytics_enabled === true &&
        siteSettings.analytics_provider === 'ga4' &&
        !!analyticsId &&
        /^G-[A-Z0-9]+$/.test(analyticsId);

    useEffect(() => {
        setMobileOpen(false);
        setMobileProjectsOpen(false);
    }, [pageUrl]);

    useEffect(() => {
        const handleScroll = (): void => {
            setIsScrolled(window.scrollY > 20);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    function switchLanguage(code: string): void {
        setMobileOpen(false);

        router.visit(`/language/${code}`, {
            preserveScroll: true,
        });
    }

    function publicHref(path: string): string {
        return localizedPublicHref(path, currentLocale, defaultLocale);
    }

    function isActivePath(path: string): boolean {
        if (path === '/') {
            return currentPath === '/';
        }

        return currentPath === path || currentPath.startsWith(`${path}/`);
    }

    function isProjectNavActive(): boolean {
        return projectNavLinks.some((link) => isActivePath(link.href));
    }

    function isTheProjectActive(): boolean {
        return isActivePath('/project');
    }

    function isActivitiesActive(): boolean {
        return isActivePath('/activities');
    }

    function renderTheProjectDesktopNav(): ReactElement {
        const active = isTheProjectActive();

        return (
            <li key="nav-the-project">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className={cn(
                                'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium outline-hidden transition-colors',
                                active
                                    ? isScrolled || !blendHeader
                                        ? 'bg-(--public-primary)/8 text-(--public-primary-hover)'
                                        : 'bg-white/14 text-white'
                                    : isScrolled || !blendHeader
                                      ? 'text-slate-500 hover:bg-slate-100 hover:text-(--public-primary-hover)'
                                      : 'text-white/72 hover:bg-white/8 hover:text-white',
                            )}
                        >
                            {t(currentLocale, 'nav.theProject')}
                            <ChevronDown
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                            />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="center"
                        className="w-72 rounded-2xl border-(--public-border) bg-white p-2 shadow-xl"
                    >
                        <DropdownMenuItem
                            asChild
                            className="rounded-xl px-0 py-0 focus:bg-transparent"
                        >
                            <Link
                                href={publicHref('/project')}
                                className="block rounded-xl px-4 py-3 transition-colors hover:bg-slate-50"
                            >
                                <span className="block text-sm font-semibold text-(--public-primary-hover)">
                                    {t(currentLocale, 'nav.theProject')}
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-slate-500">
                                    {t(currentLocale, 'nav.theProjectDescription')}
                                </span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </li>
        );
    }

    function renderActivitiesDesktopNav(): ReactElement {
        const active = isActivitiesActive();

        return (
            <li key="nav-activities">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className={cn(
                                'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium outline-hidden transition-colors',
                                active
                                    ? isScrolled || !blendHeader
                                        ? 'bg-(--public-primary)/8 text-(--public-primary-hover)'
                                        : 'bg-white/14 text-white'
                                    : isScrolled || !blendHeader
                                      ? 'text-slate-500 hover:bg-slate-100 hover:text-(--public-primary-hover)'
                                      : 'text-white/72 hover:bg-white/8 hover:text-white',
                            )}
                        >
                            {t(currentLocale, 'nav.activities')}
                            <ChevronDown
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                            />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="center"
                        className="w-72 rounded-2xl border-(--public-border) bg-white p-2 shadow-xl"
                    >
                        {activitiesNavDomains.map((domain) => (
                            <DropdownMenuItem
                                key={domain.slug}
                                asChild
                                className="rounded-xl px-0 py-0 focus:bg-transparent"
                            >
                                <Link
                                    href={publicHref(`/activities?domain=${domain.slug}`)}
                                    className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-slate-50"
                                >
                                    <span className="block text-sm font-medium text-(--public-primary-hover)">
                                        {t(currentLocale, domain.key)}
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                        <div className="mx-2 my-1 border-t border-slate-100" />
                        <DropdownMenuItem
                            asChild
                            className="rounded-xl px-0 py-0 focus:bg-transparent"
                        >
                            <Link
                                href={publicHref('/activities')}
                                className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-slate-50"
                            >
                                <span className="block text-sm font-medium text-(--public-accent)">
                                    {t(currentLocale, 'nav.viewAllActivities')}
                                </span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </li>
        );
    }

    function renderPrimaryNavLink(
        link: (typeof primaryNavLinks)[number],
    ): ReactElement {
        const active = isActivePath(link.href);

        return (
            <li key={link.href}>
                <Link
                    href={publicHref(link.href)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                        'rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
                        active
                            ? isScrolled || !blendHeader
                                ? 'bg-(--public-primary)/8 text-(--public-primary-hover)'
                                : 'bg-white/14 text-white'
                            : isScrolled || !blendHeader
                              ? 'text-slate-500 hover:bg-slate-100 hover:text-(--public-primary-hover)'
                              : 'text-white/72 hover:bg-white/8 hover:text-white',
                    )}
                >
                    {t(currentLocale, link.key)}
                </Link>
            </li>
        );
    }

    function renderProjectsDesktopNav(): ReactElement {
        return (
            <li key="nav-projects">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            data-test="public-projects-menu-trigger"
                            className={cn(
                                'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium outline-hidden transition-colors',
                                isProjectNavActive()
                                    ? isScrolled || !blendHeader
                                        ? 'bg-(--public-primary)/8 text-(--public-primary-hover)'
                                        : 'bg-white/14 text-white'
                                    : isScrolled || !blendHeader
                                      ? 'text-slate-500 hover:bg-slate-100 hover:text-(--public-primary-hover)'
                                      : 'text-white/72 hover:bg-white/8 hover:text-white',
                            )}
                        >
                            {t(currentLocale, 'nav.projects')}
                            <ChevronDown
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                            />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="center"
                        data-test="public-projects-menu-content"
                        className="w-80 rounded-2xl border-(--public-border) bg-white p-2 shadow-xl"
                    >
                        {projectNavLinks.map((link) => (
                            <DropdownMenuItem
                                key={link.href}
                                asChild
                                className="rounded-xl px-0 py-0 focus:bg-transparent"
                            >
                                <Link
                                    href={link.href}
                                    className="block rounded-xl px-4 py-3 transition-colors hover:bg-slate-50"
                                >
                                    <span className="block text-sm font-semibold text-(--public-primary-hover)">
                                        {link.label}
                                    </span>
                                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                                        {link.description}
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </li>
        );
    }

    function renderProjectsMobileNav(): ReactElement {
        return (
            <li key="mobile-nav-projects">
                <div className="overflow-hidden rounded-2xl border border-(--public-border) bg-white">
                    <button
                        type="button"
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-(--public-primary)"
                        onClick={() => setMobileProjectsOpen((open) => !open)}
                        aria-expanded={mobileProjectsOpen}
                    >
                        {t(currentLocale, 'nav.projects')}
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-slate-400 transition-transform',
                                mobileProjectsOpen && 'rotate-180',
                            )}
                            aria-hidden="true"
                        />
                    </button>
                    {mobileProjectsOpen && (
                        <div className="border-t border-(--public-border) px-2 py-2">
                            <ul className="space-y-1">
                                {projectNavLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                'block rounded-xl px-3 py-2.5 text-sm transition-colors',
                                                isActivePath(link.href)
                                                    ? 'bg-(--public-accent)/6 text-(--public-primary-hover)'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-(--public-primary-hover)',
                                            )}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <span className="block font-medium">
                                                {link.label}
                                            </span>
                                            <span className="mt-1 block text-xs leading-5 text-slate-500">
                                                {link.description}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </li>
        );
    }

    return (
        <div className="gov-shell flex min-h-screen flex-col">
            <Seo
                title={title}
                description={siteDescription}
                canonicalUrl={currentUrl || undefined}
                siteName={siteTitle}
                imageUrl={imageUrl}
                type={seoType}
                locale={currentLocale}
                noIndex={noIndex}
                alternates={[
                    ...localeAlternates,
                    ...(defaultLocaleUrl
                        ? [
                              {
                                  hrefLang: 'x-default',
                                  href: defaultLocaleUrl,
                              },
                          ]
                        : []),
                ]}
                structuredData={[
                    organizationSchema,
                    websiteSchema,
                    ...(Array.isArray(structuredData)
                        ? structuredData
                        : structuredData
                          ? [structuredData]
                          : []),
                ]}
            />
            {analyticsEnabled && analyticsId && (
                <Head>
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${analyticsId}');`,
                        }}
                    />
                </Head>
            )}

            <a
                href={'#main-content'}
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-60 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium"
            >
                {t(currentLocale, 'common.skipToContent')}
            </a>

            {/* Top utility bar — always visible, official site strip */}
            <div className="fixed inset-x-0 top-0 z-50 border-b border-(--public-primary)/20 bg-(--public-primary) text-white">
                <div className="gov-container">
                    <div className="flex h-9 items-center justify-between gap-4">
                        <p className="hidden text-[10px] font-medium tracking-[0.12em] text-white/70 uppercase sm:block">
                            {t(currentLocale, 'site.official')}
                        </p>
                        <div className="ml-auto flex items-center gap-3">
                            <div className="flex items-center gap-0.5 text-[10px] font-semibold tracking-[0.14em] text-white/70 uppercase">
                                {languages.map((language) => (
                                    <button
                                        key={language.code}
                                        type="button"
                                        onClick={() =>
                                            switchLanguage(language.code)
                                        }
                                        className={cn(
                                            'rounded px-1.5 py-0.5 leading-none transition-colors',
                                            currentLocale === language.code
                                                ? 'bg-white/15 text-white'
                                                : 'hover:text-white',
                                        )}
                                    >
                                        {language.label}
                                    </button>
                                ))}
                            </div>
                            <span className="h-3 w-px bg-white/20" />
                            <BVIButton
                                label={t(currentLocale, 'bvi.label')}
                                className="h-6 rounded border-white/15 bg-white/8 px-2 text-[10px] text-white hover:bg-white/15 hover:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <header
                className={cn(
                    'fixed inset-x-0 top-9 z-40 border-b transition-all duration-300',
                    isScrolled
                        ? 'border-slate-200/80 bg-white/88 text-(--public-primary-hover) shadow-sm backdrop-blur-md'
                        : blendHeader
                          ? 'border-transparent bg-(--public-primary) text-white shadow-none'
                          : 'border-slate-200/80 bg-white/92 text-(--public-primary-hover) shadow-sm backdrop-blur-md',
                )}
            >
                <div className="gov-container py-2.5">
                    <div className="flex items-center justify-between gap-3">
                        <Link
                            href={publicHref('/')}
                            className="flex min-w-0 items-center gap-2.5"
                        >
                            <div
                                className={cn(
                                    'flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md shadow-sm ring-1',
                                    isScrolled || !blendHeader
                                        ? 'bg-(--public-primary)/6 ring-(--public-primary)/10'
                                        : 'bg-white/8 ring-white/6',
                                )}
                            >
                                <NishonLogo />
                            </div>

                            <div className="max-w-60 min-w-0">
                                <p
                                    className={cn(
                                        'truncate text-sm leading-none font-semibold',
                                        isScrolled || !blendHeader
                                            ? 'text-(--public-primary-hover)'
                                            : 'text-white',
                                    )}
                                >
                                    {t(currentLocale, 'site.center')}
                                </p>
                                <p
                                    className={cn(
                                        'hidden truncate pt-1 text-[10px] leading-none xl:block',
                                        isScrolled || !blendHeader
                                            ? 'text-slate-500'
                                            : 'text-white/60',
                                    )}
                                >
                                    {t(currentLocale, 'site.project')}
                                </p>
                            </div>
                        </Link>

                        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
                            <nav aria-label="Primary" className="min-w-0">
                                <ul className="flex flex-wrap items-center gap-0.5">
                                    {primaryNavLinks
                                        .slice(0, 2)
                                        .map(renderPrimaryNavLink)}
                                    {renderTheProjectDesktopNav()}
                                    {renderActivitiesDesktopNav()}
                                    {primaryNavLinks
                                        .slice(2)
                                        .map(renderPrimaryNavLink)}
                                </ul>
                            </nav>
                        </div>

                        {/* Language switcher and BVI moved to top utility bar */}

                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium lg:hidden',
                                        isScrolled || !blendHeader
                                            ? 'border-slate-200 bg-white text-slate-700'
                                            : 'border-white/12 bg-white/8 text-white',
                                    )}
                                    aria-label="Toggle navigation"
                                    aria-controls="mobile-primary-navigation"
                                >
                                    {mobileOpen ? (
                                        <X
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Menu
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    )}
                                    {t(currentLocale, 'common.menu')}
                                </button>
                            </SheetTrigger>
                            <SheetContent
                                id="mobile-primary-navigation"
                                side="right"
                                className="w-full max-w-sm border-l border-(--public-border) bg-(--public-surface) p-0"
                            >
                                <SheetHeader className="border-b border-(--public-border) px-6 py-5 text-left">
                                    <SheetTitle className="text-base text-(--public-primary-hover)">
                                        {t(
                                            currentLocale,
                                            'common.siteNavigation',
                                        )}
                                    </SheetTitle>
                                    <SheetDescription>
                                        {t(
                                            currentLocale,
                                            'common.navigationDescription',
                                        )}
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="space-y-4 px-5 py-5">
                                    <nav aria-label="Mobile">
                                        <ul className="space-y-1.5">
                                            {primaryNavLinks.map((link) => {
                                                const active = isActivePath(
                                                    link.href,
                                                );

                                                return (
                                                    <li key={link.href}>
                                                        <Link
                                                            href={publicHref(
                                                                link.href,
                                                            )}
                                                            aria-current={
                                                                active
                                                                    ? 'page'
                                                                    : undefined
                                                            }
                                                            className={cn(
                                                                'flex items-center justify-between rounded-2xl border bg-white px-4 py-3 text-sm font-medium transition-colors',
                                                                active
                                                                    ? 'border-(--public-accent)/25 bg-(--public-accent)/6 text-(--public-primary-hover)'
                                                                    : 'border-(--public-border) text-(--public-primary)',
                                                            )}
                                                            onClick={() =>
                                                                setMobileOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            {t(
                                                                currentLocale,
                                                                link.key,
                                                            )}
                                                            <ChevronRight
                                                                className="h-4 w-4 text-slate-400"
                                                                aria-hidden="true"
                                                            />
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                            <li key="mobile-the-project">
                                                <Link
                                                    href={publicHref('/project')}
                                                    className={cn(
                                                        'flex items-center justify-between rounded-2xl border bg-white px-4 py-3 text-sm font-medium transition-colors',
                                                        isTheProjectActive()
                                                            ? 'border-(--public-accent)/25 bg-(--public-accent)/6 text-(--public-primary-hover)'
                                                            : 'border-(--public-border) text-(--public-primary)',
                                                    )}
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    {t(currentLocale, 'nav.theProject')}
                                                    <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                                </Link>
                                            </li>
                                            {renderProjectsMobileNav()}
                                        </ul>
                                    </nav>

                                    {/* Language switcher and BVI are in the top utility bar, always visible */}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <BVIPanel />

            <main
                id="main-content"
                tabIndex={-1}
                className={cn(
                    'flex-1',
                    blendHeader
                        ? bviState.enabled
                            ? 'pt-[calc(2.25rem+3.5rem+2.75rem)]'
                            : 'pt-9'
                        : bviState.enabled
                          ? 'pt-[calc(2.25rem+3.5rem+2.75rem)]'
                          : 'pt-[calc(2.25rem+3.5rem)]',
                )}
            >
                {children}
            </main>

            {/* Partner logos strip */}
            <div className="border-t border-slate-200 bg-white py-6">
                <div className="gov-container">
                    <p className="mb-4 text-center text-xs font-medium tracking-[0.14em] text-slate-400 uppercase">
                        {t(currentLocale, 'footer.fundedByFull')}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-5 py-2.5">
                            <span className="text-sm font-semibold text-slate-700">World Bank</span>
                            <span className="text-xs text-slate-400">IDA</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-5 py-2.5">
                            <span className="text-sm font-semibold text-slate-700">SDC</span>
                            <span className="text-xs text-slate-400">Switzerland</span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="border-t border-(--public-primary) bg-(--public-primary-hover) text-white">
                <div className="gov-container py-14">
                    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
                        <div>
                            <p className="gov-kicker mb-3 text-(--public-accent)">
                                {t(currentLocale, 'footer.kicker')}
                            </p>
                            <h2 className="max-w-lg text-3xl font-semibold text-white">
                                {t(currentLocale, 'site.project')}
                            </h2>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-white/72">
                                {t(currentLocale, 'footer.subheading')}
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-white">
                                {t(currentLocale, 'footer.sections')}
                            </h3>
                            <ul className="space-y-3 text-sm text-white/72">
                                {primaryNavLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={publicHref(link.href)}
                                            className="hover:text-white"
                                        >
                                            {t(currentLocale, link.key)}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link href={publicHref('/project')} className="hover:text-white">
                                        {t(currentLocale, 'nav.theProject')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={publicHref('/documents')} className="hover:text-white">
                                        {t(currentLocale, 'nav.documents')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={publicHref('/media')} className="hover:text-white">
                                        {t(currentLocale, 'nav.media')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-white">
                                {t(currentLocale, 'nav.activities')}
                            </h3>
                            <ul className="space-y-3 text-sm text-white/72">
                                {activitiesNavDomains.map((domain) => (
                                    <li key={domain.slug}>
                                        <Link
                                            href={publicHref(`/activities?domain=${domain.slug}`)}
                                            className="hover:text-white"
                                        >
                                            {t(currentLocale, domain.key)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div id="footer-contact">
                            <h3 className="mb-4 text-sm font-semibold text-white">
                                {t(currentLocale, 'footer.contact')}
                            </h3>
                            <ul className="space-y-4 text-sm text-white/72">
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--public-accent)" />
                                    <span>
                                        {page.settings?.contact_address ??
                                            t(currentLocale, 'site.country')}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 shrink-0 text-(--public-accent)" />
                                    <span>
                                        {page.settings?.contact_phone ??
                                            '+992 (000) 000-000'}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 shrink-0 text-(--public-accent)" />
                                    <span>
                                        {page.settings?.contact_email ??
                                            'info@example.tj'}
                                    </span>
                                </li>
                                <li className="mt-2 pt-2 border-t border-white/10">
                                    <Link
                                        href={publicHref('/grm/submit')}
                                        className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20"
                                    >
                                        {t(currentLocale, 'grm.submit')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
                        <p>
                            © {new Date().getFullYear()}{' '}
                            {t(currentLocale, 'site.center')} ·{' '}
                            {t(currentLocale, 'site.country')}
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href={publicHref('/pages/privacy-policy')}
                                className="transition-colors hover:text-white/70"
                            >
                                {t(currentLocale, 'footer.privacyPolicy')}
                            </Link>
                            <Link
                                href={publicHref('/pages/accessibility')}
                                className="transition-colors hover:text-white/70"
                            >
                                {t(currentLocale, 'footer.accessibility')}
                            </Link>
                            <Link
                                href={publicHref('/sitemap.xml')}
                                className="transition-colors hover:text-white/70"
                            >
                                {t(currentLocale, 'footer.sitemap')}
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

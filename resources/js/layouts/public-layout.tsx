import type { PageProps } from '@inertiajs/core';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    Mail,
    MapPin,
    Menu,
    Phone,
    X,
} from 'lucide-react';
import { type PropsWithChildren, useEffect, useState } from 'react';

import { BVIButton } from '@/components/bvi/bvi-button';
import NishonLogo from '@/components/nishon-logo';
import Seo from '@/components/seo';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';
import { cn } from '@/lib/utils';

const navLinks = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.about', href: '/about' },
    { key: 'nav.project', href: '/project' },
    { key: 'nav.news', href: '/news' },
    { key: 'nav.announcements', href: '/procurement' },
    { key: 'nav.contact', href: '/contact' },
];

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
    const [isScrolled, setIsScrolled] = useState(false);
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
                Skip to main content
            </a>

            <header
                className={cn(
                    'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300',
                    isScrolled
                        ? 'border-slate-200/80 bg-white/88 text-[var(--gov-navy-strong)] shadow-sm backdrop-blur-md'
                        : blendHeader
                          ? 'border-transparent bg-[var(--gov-navy)] text-white shadow-none'
                          : 'border-slate-200/80 bg-white/92 text-[var(--gov-navy-strong)] shadow-sm backdrop-blur-md',
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
                                    'flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ring-1',
                                    isScrolled || !blendHeader
                                        ? 'bg-[var(--gov-navy)]/6 ring-[var(--gov-navy)]/10'
                                        : 'bg-white/8 ring-white/6',
                                )}
                            >
                                <NishonLogo />
                            </div>

                            <div className="min-w-0 max-w-[15rem]">
                                <p
                                    className={cn(
                                        'truncate text-sm font-semibold leading-none',
                                        isScrolled || !blendHeader ? 'text-[var(--gov-navy-strong)]' : 'text-white',
                                    )}
                                >
                                    {t(currentLocale, 'site.center')}
                                </p>
                                <p
                                    className={cn(
                                        'hidden truncate pt-1 text-[10px] leading-none xl:block',
                                        isScrolled || !blendHeader ? 'text-slate-500' : 'text-white/60',
                                    )}
                                >
                                    {t(currentLocale, 'site.project')}
                                </p>
                            </div>
                        </Link>

                        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
                            <nav aria-label="Primary" className="min-w-0">
                                <ul className="flex flex-wrap items-center gap-0.5">
                                    {navLinks.map((link) => {
                                        const active = isActivePath(link.href);

                                        return (
                                            <li key={link.href}>
                                                <Link
                                                    href={publicHref(link.href)}
                                                    aria-current={
                                                        active
                                                            ? 'page'
                                                            : undefined
                                                    }
                                                    className={cn(
                                                        'rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
                                                        active
                                                            ? isScrolled || !blendHeader
                                                                ? 'bg-[var(--gov-navy)]/8 text-[var(--gov-navy-strong)]'
                                                                : 'bg-white/14 text-white'
                                                            : isScrolled || !blendHeader
                                                              ? 'text-slate-500 hover:bg-slate-100 hover:text-[var(--gov-navy-strong)]'
                                                              : 'text-white/72 hover:bg-white/8 hover:text-white',
                                                    )}
                                                >
                                                    {t(currentLocale, link.key)}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </div>

                        <div className="hidden items-center gap-2.5 lg:flex">
                            <div
                                className={cn(
                                    'flex items-center gap-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase',
                                    isScrolled || !blendHeader ? 'text-slate-500' : 'text-white/62',
                                )}
                            >
                                {languages.map((language) => (
                                    <button
                                        key={language.code}
                                        type="button"
                                        onClick={() =>
                                            switchLanguage(language.code)
                                        }
                                        className={cn(
                                            'rounded px-1.5 py-1 leading-none transition-colors',
                                            currentLocale === language.code
                                                ? isScrolled || !blendHeader
                                                    ? 'bg-[var(--gov-navy)]/10 text-[var(--gov-navy-strong)]'
                                                    : 'bg-white/12 text-white'
                                                : isScrolled || !blendHeader
                                                  ? 'hover:text-[var(--gov-navy-strong)]'
                                                  : 'hover:text-white'
                                        )}
                                    >
                                        {language.label}
                                    </button>
                                ))}
                            </div>

                            <BVIButton
                                label="Для слабовидящих"
                                className={cn(
                                    'h-8 rounded-md px-2.5 text-[11px]',
                                    isScrolled || !blendHeader
                                        ? 'border-slate-200 bg-white text-[var(--gov-navy-strong)] hover:bg-slate-50'
                                        : 'border-white/10 bg-white/6 text-white hover:bg-white/12 hover:text-white',
                                )}
                            />
                        </div>

                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium lg:hidden',
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
                                    Menu
                                </button>
                            </SheetTrigger>
                            <SheetContent
                                id="mobile-primary-navigation"
                                side="right"
                                className="w-full max-w-sm border-l border-[#d4ddd4] bg-[var(--gov-surface)] p-0"
                            >
                                <SheetHeader className="border-b border-[#d4ddd4] px-6 py-5 text-left">
                                    <SheetTitle className="text-base text-[var(--gov-navy-strong)]">
                                        Site navigation
                                    </SheetTitle>
                                    <SheetDescription>
                                        Browse public sections, switch language,
                                        or access search and grievance services.
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="space-y-4 px-5 py-5">
                                    <nav aria-label="Mobile">
                                        <ul className="space-y-1.5">
                                            {navLinks.map((link) => {
                                                const active = isActivePath(link.href);

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
                                                                    ? 'border-[var(--gov-blue)]/25 bg-[var(--gov-blue)]/6 text-[var(--gov-navy-strong)]'
                                                                    : 'border-[#d4ddd4] text-[var(--gov-navy)]',
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
                                        </ul>
                                    </nav>

                                    <div className="flex flex-wrap gap-2">
                                        {languages.map((language) => (
                                            <button
                                                key={language.code}
                                                type="button"
                                                onClick={() =>
                                                    switchLanguage(
                                                        language.code,
                                                    )
                                                }
                                                className={`rounded-full border px-3 py-2 text-xs font-semibold ${
                                                    currentLocale ===
                                                    language.code
                                                        ? 'border-[var(--gov-navy)] bg-[var(--gov-navy)] text-white'
                                                        : 'border-slate-200 bg-white text-slate-600'
                                                }`}
                                            >
                                                {language.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <BVIButton
                                            label="Версия для слабовидящих"
                                            className="w-full rounded-lg border-slate-300"
                                        />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <main
                id="main-content"
                tabIndex={-1}
                className={cn('flex-1', blendHeader ? 'pt-0' : 'pt-16')}
            >
                {children}
            </main>

            <footer className="mt-16 border-t border-[#16345e] bg-[var(--gov-navy-strong)] text-white">
                <div className="gov-container py-14">
                    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
                        <div>
                            <p className="gov-kicker mb-3 text-[var(--gov-gold)]">
                                Government Service Portal
                            </p>
                            <h2 className="max-w-lg text-3xl font-semibold text-white">
                                Public information, services, and grievance
                                access in one place.
                            </h2>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-white/72">
                                The portal provides official project updates,
                                procurement notices, document access, and
                                public-service channels for beneficiaries,
                                citizens, and suppliers.
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-white">
                                Sections
                            </h3>
                            <ul className="space-y-3 text-sm text-white/72">
                                {navLinks.slice(0, 6).map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={publicHref(link.href)}
                                            className="hover:text-white"
                                        >
                                            {t(currentLocale, link.key)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-white">
                                Services
                            </h3>
                            <ul className="space-y-3 text-sm text-white/72">
                                <li>
                                    <Link
                                        href={publicHref('/documents')}
                                        className="hover:text-white"
                                    >
                                        Document repository
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={publicHref('/procurement')}
                                        className="hover:text-white"
                                    >
                                        Procurement notices
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={publicHref('/grm')}
                                        className="hover:text-white"
                                    >
                                        Grievance information
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={publicHref('/grm/submit')}
                                        className="hover:text-white"
                                    >
                                        Submit a grievance
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={publicHref('/subscribe')}
                                        className="hover:text-white"
                                    >
                                        Email subscriptions
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div id="footer-contact">
                            <h3 className="mb-4 text-sm font-semibold text-white">
                                Contact
                            </h3>
                            <ul className="space-y-4 text-sm text-white/72">
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gov-gold)]" />
                                    <span>
                                        {page.settings?.contact_address ??
                                            'Dushanbe, Republic of Tajikistan'}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 shrink-0 text-[var(--gov-gold)]" />
                                    <span>
                                        {page.settings?.contact_phone ??
                                            '+992 (000) 000-000'}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 shrink-0 text-[var(--gov-gold)]" />
                                    <span>
                                        {page.settings?.contact_email ??
                                            'info@example.tj'}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
                        <p>
                            © {new Date().getFullYear()} Project Implementation
                            Center
                        </p>
                        <p>Official government project information portal</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

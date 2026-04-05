import type { PageProps } from '@inertiajs/core';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    MapPin,
    Menu,
    Phone,
    PhoneCall,
    Search,
    X,
} from 'lucide-react';
import {
    type PropsWithChildren,
    type ReactElement,
    useEffect,
    useRef,
    useState,
} from 'react';

import { BVIButton } from '@/components/bvi/bvi-button';
import { BVIPanel } from '@/components/bvi/bvi-panel';
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
import { useBVI } from '@/providers/bvi-provider';

const primaryNavLinks = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.about', href: '/about' },
    { key: 'nav.projects', href: '/projects' },
    { key: 'nav.activities', href: '/activities' },
    { key: 'nav.news', href: '/news' },
    { key: 'nav.procurement', href: '/procurement' },
    { key: 'nav.grm', href: '/grm' },
    { key: 'nav.contact', href: '/contact' },
];

const activitiesNavDomains = [
    { key: 'nav.domain1', slug: 'digital-infrastructure' },
    { key: 'nav.domain2', slug: 'digital-public-services' },
    { key: 'nav.domain3', slug: 'digital-identity-payments' },
    { key: 'nav.domain4', slug: 'cybersecurity' },
    { key: 'nav.domain5', slug: 'legal-governance' },
    { key: 'nav.domain6', slug: 'digital-skills' },
    { key: 'nav.domain7', slug: 'school-connectivity' },
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

interface NavigationProjectPage {
    slug: string;
    href: string;
    translations?: Array<{ language: string; title: string }>;
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
        og_image_default?: string;
    };
    navigation?: {
        project_pages?: NavigationProjectPage[];
    };
    settings?: {
        contact_address?: string;
        contact_phone?: string;
        contact_email?: string;
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
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { state: bviState } = useBVI();
    const inertiaPage = usePage<LayoutPageProps>();
    const page = inertiaPage.props;

    const currentLocale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const siteSettings = page.siteSettings ?? {};

    const siteTitle = siteSettings.site_title ?? 'PIC TDFP';
    const siteDescription = description ?? siteSettings.site_description;

    // Формируем канонический URL без лишних параметров (кроме lang)
    const canonicalUrl = (() => {
        if (!currentUrl) return undefined;
        try {
            const url = new URL(currentUrl);
            const lang = url.searchParams.get('lang');
            url.search = '';
            if (lang && lang !== defaultLocale) {
                url.searchParams.set('lang', lang);
            }
            return url.toString();
        } catch {
            return currentUrl;
        }
    })();

    // Автоматическая генерация hreflang альтернатив
    const localeAlternates = currentUrl
        ? (languages
              .map((language) => {
                  try {
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
                  } catch {
                      return null;
                  }
              })
              .filter(Boolean) as Array<{ hrefLang: string; href: string }>)
        : [];

    const defaultLocaleUrl = currentUrl
        ? (() => {
              try {
                  const url = new URL(currentUrl);
                  url.searchParams.delete('lang');
                  return url.toString();
              } catch {
                  return undefined;
              }
          })()
        : undefined;

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'GovernmentOrganization',
        name: siteTitle,
        url: canonicalUrl || currentUrl || undefined,
        email: siteSettings.contact_email || undefined,
        telephone: siteSettings.contact_phone || undefined,
        address: siteSettings.contact_address || undefined,
        sameAs: [
            siteSettings.facebook_url,
            siteSettings.twitter_url,
            siteSettings.youtube_url,
        ].filter(Boolean),
    };

    const analyticsId = siteSettings.google_analytics_id?.trim();
    const analyticsEnabled =
        siteSettings.analytics_enabled === true &&
        siteSettings.analytics_provider === 'ga4' &&
        !!analyticsId &&
        /^G-[A-Z0-9]+$/.test(analyticsId);

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            setMobileOpen(false);
            setSearchOpen(false);
            setSearchQuery('');
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [inertiaPage.url]);

    useEffect(() => {
        const handleScroll = (): void => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [searchOpen]);

    function submitSearch(): void {
        const q = searchQuery.trim();
        if (!q) return;
        router.get('/search', { q });
        setSearchOpen(false);
        setSearchQuery('');
    }

    function switchLanguage(code: string): void {
        setMobileOpen(false);
        fetch(`/language/${code}`).then(() => {
            window.location.reload();
        });
    }

    function publicHref(path: string): string {
        return localizedPublicHref(path, currentLocale, defaultLocale);
    }

    function isActivePath(path: string): boolean {
        const currentPath = new URL(inertiaPage.url || '/', 'https://tdfp.test')
            .pathname;
        if (path === '/') return currentPath === '/';
        return currentPath === path || currentPath.startsWith(`${path}/`);
    }

    function renderPrimaryNavLink(
        link: (typeof primaryNavLinks)[0],
    ): ReactElement {
        const active = isActivePath(link.href);
        return (
            <li key={link.href}>
                <Link
                    href={publicHref(link.href)}
                    prefetch
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                        'rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
                        active
                            ? isScrolled || !blendHeader
                                ? 'bg-(--public-primary)/8 font-semibold text-(--public-primary-hover)'
                                : 'bg-white/14 font-semibold text-white'
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

    return (
        <div className="gov-shell flex min-h-screen flex-col">
            <Seo
                title={title}
                description={siteDescription}
                canonicalUrl={canonicalUrl}
                siteName={siteTitle}
                imageUrl={imageUrl || siteSettings.og_image_default}
                type={seoType}
                locale={currentLocale}
                noIndex={noIndex}
                alternates={[
                    ...localeAlternates,
                    ...(defaultLocaleUrl
                        ? [{ hrefLang: 'x-default', href: defaultLocaleUrl }]
                        : []),
                ]}
                structuredData={[
                    organizationSchema,
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
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-60 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium"
            >
                {t(currentLocale, 'common.skipToContent')}
            </a>

            {/* Глобальный контейнер шапки — убрали тень */}
            <div className="fixed inset-x-0 top-0 z-50 flex flex-col">
                <BVIPanel />

                {/* Top utility bar — убрали border-b */}
                <div className="bg-(--public-primary) text-white">
                    <div className="gov-container">
                        <div className="flex h-9 items-center justify-between gap-4">
                            <p className="hidden text-[10px] font-medium tracking-[0.12em] text-white/70 uppercase sm:block">
                                <a
                                    href={`tel:${siteSettings.contact_phone?.replace(/\D/g, '')}`}
                                    className="flex items-center gap-1.5"
                                >
                                    <PhoneCall className="h-4 w-4" />
                                    {siteSettings.contact_phone ??
                                        '+992 (000) 000-000'}
                                </a>
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
                        'border-b transition-all duration-300', // Оставляем бордер только здесь
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
                                {searchOpen ? (
                                    <form
                                        className="flex w-full max-w-lg items-center gap-2"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            submitSearch();
                                        }}
                                    >
                                        <div className="relative flex-1">
                                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <input
                                                ref={searchInputRef}
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={t(
                                                    currentLocale,
                                                    'common.search',
                                                )}
                                                className="h-9 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-slate-800 ring-0 outline-none focus:border-(--public-accent) focus:ring-1 focus:ring-(--public-accent)/30"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="rounded-lg bg-(--public-accent) px-4 py-2 text-sm font-medium text-white hover:bg-(--public-accent-hover)"
                                        >
                                            {t(currentLocale, 'common.search')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchOpen(false);
                                                setSearchQuery('');
                                            }}
                                            className="rounded-lg p-2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <nav
                                        aria-label="Primary"
                                        className="min-w-0"
                                    >
                                        <ul className="flex flex-wrap items-center gap-0.5">
                                            {primaryNavLinks.map(
                                                renderPrimaryNavLink,
                                            )}
                                        </ul>
                                    </nav>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setSearchOpen((v) => !v)}
                                className={cn(
                                    'hidden rounded-md p-2 lg:inline-flex',
                                    isScrolled || !blendHeader
                                        ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white',
                                )}
                                aria-label={t(currentLocale, 'common.search')}
                            >
                                <Search className="h-4 w-4" />
                            </button>

                            <Sheet
                                open={mobileOpen}
                                onOpenChange={setMobileOpen}
                            >
                                <SheetTrigger asChild>
                                    <button
                                        type="button"
                                        className={cn(
                                            'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium lg:hidden',
                                            isScrolled || !blendHeader
                                                ? 'border-slate-200 bg-white text-slate-700'
                                                : 'border-white/12 bg-white/8 text-white',
                                        )}
                                    >
                                        {mobileOpen ? (
                                            <X className="h-4 w-4" />
                                        ) : (
                                            <Menu className="h-4 w-4" />
                                        )}
                                        {t(currentLocale, 'common.menu')}
                                    </button>
                                </SheetTrigger>
                                <SheetContent
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
                                        <form
                                            className="flex items-center gap-2"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                submitSearch();
                                            }}
                                        >
                                            <div className="relative flex-1">
                                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        currentLocale,
                                                        'common.search',
                                                    )}
                                                    className="h-10 w-full rounded-xl border border-(--public-border) bg-white pr-3 pl-9 text-sm text-slate-800 outline-none focus:border-(--public-accent) focus:ring-1 focus:ring-(--public-accent)/30"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="rounded-xl bg-(--public-accent) px-4 py-2.5 text-sm font-medium text-white"
                                            >
                                                <Search className="h-4 w-4" />
                                            </button>
                                        </form>

                                        <nav aria-label="Mobile">
                                            <ul className="space-y-1.5">
                                                {primaryNavLinks.map((link) => (
                                                    <li key={link.href}>
                                                        <Link
                                                            href={publicHref(
                                                                link.href,
                                                            )}
                                                            onClick={() =>
                                                                setMobileOpen(
                                                                    false,
                                                                )
                                                            }
                                                            className={cn(
                                                                'flex items-center justify-between rounded-2xl border bg-white px-4 py-3 text-sm font-medium transition-colors',
                                                                isActivePath(
                                                                    link.href,
                                                                )
                                                                    ? 'border-(--public-accent)/25 bg-(--public-accent)/6 text-(--public-primary-hover)'
                                                                    : 'border-(--public-border) text-(--public-primary)',
                                                            )}
                                                        >
                                                            {t(
                                                                currentLocale,
                                                                link.key,
                                                            )}
                                                            <ChevronRight className="h-4 w-4 text-slate-400" />
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </header>
            </div>

            <main
                id="main-content"
                tabIndex={-1}
                className={cn(
                    'flex-1 transition-all duration-300',
                    blendHeader ? 'pt-9' : bviState.enabled ? 'pt-48' : 'pt-23',
                )}
            >
                {children}
            </main>

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
                                            href={publicHref(
                                                `/activities?domain=${domain.slug}`,
                                            )}
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
                                        {siteSettings.contact_address ??
                                            t(currentLocale, 'site.country')}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 shrink-0 text-(--public-accent)" />
                                    <span>
                                        {siteSettings.contact_phone ??
                                            '+992 (000) 000-000'}
                                    </span>
                                </li>
                                <li className="mt-2 border-t border-white/10 pt-2">
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

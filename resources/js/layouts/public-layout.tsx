import type { PageProps } from '@inertiajs/core';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    Mail,
    MapPin,
    Menu,
    Phone,
    Search,
    X,
} from 'lucide-react';
import { type PropsWithChildren, useState } from 'react';

import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';

const navLinks = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.about', href: '/about' },
    { key: 'nav.project', href: '/project' },
    { key: 'nav.activities', href: '/activities' },
    { key: 'nav.news', href: '/news' },
    { key: 'nav.procurement', href: '/procurement' },
    { key: 'nav.documents', href: '/documents' },
    { key: 'nav.media', href: '/media' },
    { key: 'nav.contact', href: '/contact' },
];

const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'tj', label: 'TJ' },
];

interface PublicLayoutProps extends PropsWithChildren {
    title?: string;
}

interface LayoutPageProps extends PageProps {
    locale?: string;
    ziggy?: {
        location?: string;
    };
    settings?: {
        contact_address?: string;
        contact_phone?: string;
        contact_email?: string;
    };
}

export default function PublicLayout({ children, title }: PublicLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const page = usePage<LayoutPageProps>().props;
    const currentLocale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';

    function switchLanguage(code: string): void {
        router.visit(`/language/${code}`, {
            preserveScroll: true,
        });
    }

    return (
        <div className="gov-shell flex min-h-screen flex-col">
            {title && <Head title={`${title} | PIC TDFP`} />}

            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium"
            >
                Skip to main content
            </a>

            <div className="border-b border-slate-200 bg-[var(--gov-navy-strong)] text-white">
                <div className="gov-container flex min-h-11 flex-wrap items-center justify-between gap-3 py-2.5 text-xs">
                    <div className="flex items-center gap-2 text-white/80">
                        <span className="h-2 w-2 rounded-full bg-[var(--gov-gold)]" />
                        <span>{t(currentLocale, 'site.country')}</span>
                        <span className="text-white/35">/</span>
                        <span>{t(currentLocale, 'site.ministry')}</span>
                    </div>

                    <div className="flex items-center gap-3 text-white/80">
                        <Link href="/search" className="hover:text-white">
                            Search
                        </Link>
                        <span className="text-white/30">|</span>
                        <a href="#footer-contact" className="hover:text-white">
                            Contact
                        </a>
                    </div>
                </div>
            </div>

            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="gov-container py-4">
                    <div className="flex items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="flex min-w-0 items-center gap-4"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--gov-navy)] text-sm font-bold tracking-[0.18em] text-white shadow-sm">
                                PIC
                            </div>

                            <div className="min-w-0">
                                <p className="gov-kicker mb-1">
                                    Official Portal
                                </p>
                                <p className="truncate text-lg font-semibold text-[var(--gov-navy-strong)] md:text-xl">
                                    {t(currentLocale, 'site.center')}
                                </p>
                                <p className="hidden text-sm text-slate-500 md:block">
                                    {t(currentLocale, 'site.project')}
                                </p>
                            </div>
                        </Link>

                        <div className="hidden items-center gap-2 lg:flex">
                            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
                                {languages.map((language) => (
                                    <button
                                        key={language.code}
                                        onClick={() =>
                                            switchLanguage(language.code)
                                        }
                                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                            currentLocale === language.code
                                                ? 'bg-[var(--gov-navy)] text-white'
                                                : 'text-slate-600 hover:text-[var(--gov-navy)]'
                                        }`}
                                    >
                                        {language.label}
                                    </button>
                                ))}
                            </div>

                            <Button
                                asChild
                                variant="outline"
                                className="rounded-lg border-slate-300 bg-white text-slate-700 hover:border-[var(--gov-blue)] hover:text-[var(--gov-blue)]"
                            >
                                <Link href="/search">
                                    <Search className="mr-2 h-4 w-4" />
                                    Search
                                </Link>
                            </Button>

                            <Button
                                asChild
                                className="rounded-lg bg-[var(--gov-blue)] px-5 text-white hover:bg-[var(--gov-navy)]"
                            >
                                <Link href="/grm/submit">Submit grievance</Link>
                            </Button>
                        </div>

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 lg:hidden"
                            aria-expanded={mobileOpen}
                            aria-label="Toggle navigation"
                        >
                            {mobileOpen ? (
                                <X className="h-4 w-4" />
                            ) : (
                                <Menu className="h-4 w-4" />
                            )}
                            Menu
                        </button>
                    </div>
                </div>

                <div className="border-t border-slate-200 bg-white">
                    <div className="gov-container hidden items-center justify-between gap-6 lg:flex">
                        <nav aria-label="Primary" className="flex-1">
                            <ul className="flex flex-wrap items-center gap-1 py-2">
                                {navLinks.map((link) => {
                                    const active =
                                        currentUrl === link.href ||
                                        (link.href !== '/' &&
                                            currentUrl.startsWith(link.href));

                                    return (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                                                    active
                                                        ? 'bg-[var(--gov-mist)] text-[var(--gov-navy-strong)]'
                                                        : 'text-slate-600 hover:bg-slate-100 hover:text-[var(--gov-navy)]'
                                                }`}
                                            >
                                                {t(currentLocale, link.key)}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <div className="text-sm text-slate-500">
                            Public information and service access
                        </div>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="border-t border-slate-200 bg-white lg:hidden">
                        <div className="gov-container space-y-5 py-5">
                            <nav aria-label="Mobile">
                                <ul className="space-y-2">
                                    {navLinks.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-[var(--gov-navy)]"
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                            >
                                                {t(currentLocale, link.key)}
                                                <ChevronRight className="h-4 w-4 text-slate-400" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            <div className="flex flex-wrap gap-2">
                                {languages.map((language) => (
                                    <button
                                        key={language.code}
                                        onClick={() =>
                                            switchLanguage(language.code)
                                        }
                                        className={`rounded-md border px-3 py-2 text-xs font-semibold ${
                                            currentLocale === language.code
                                                ? 'border-[var(--gov-navy)] bg-[var(--gov-navy)] text-white'
                                                : 'border-slate-200 bg-white text-slate-600'
                                        }`}
                                    >
                                        {language.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="flex-1 rounded-lg border-slate-300"
                                >
                                    <Link
                                        href="/search"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        Search
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    className="flex-1 rounded-lg bg-[var(--gov-blue)] hover:bg-[var(--gov-navy)]"
                                >
                                    <Link
                                        href="/grm/submit"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Submit
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main id="main-content" className="flex-1">
                {children}
            </main>

            <footer className="mt-16 border-t border-slate-200 bg-white">
                <div className="gov-container py-12">
                    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
                        <div>
                            <p className="gov-kicker mb-3">
                                Government Service Portal
                            </p>
                            <h2 className="max-w-lg text-3xl font-semibold text-[var(--gov-navy-strong)]">
                                Public information, services, and grievance
                                access in one place.
                            </h2>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                                The portal provides official project updates,
                                procurement notices, document access, and
                                public-service channels for beneficiaries,
                                citizens, and suppliers.
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-slate-900">
                                Sections
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                {navLinks.slice(0, 6).map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="hover:text-[var(--gov-blue)]"
                                        >
                                            {t(currentLocale, link.key)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-slate-900">
                                Services
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li>
                                    <Link
                                        href="/documents"
                                        className="hover:text-[var(--gov-blue)]"
                                    >
                                        Document repository
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/procurement"
                                        className="hover:text-[var(--gov-blue)]"
                                    >
                                        Procurement notices
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/grm"
                                        className="hover:text-[var(--gov-blue)]"
                                    >
                                        Grievance information
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/grm/submit"
                                        className="hover:text-[var(--gov-blue)]"
                                    >
                                        Submit a grievance
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div id="footer-contact">
                            <h3 className="mb-4 text-sm font-semibold text-slate-900">
                                Contact
                            </h3>
                            <ul className="space-y-4 text-sm text-slate-600">
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gov-blue)]" />
                                    <span>
                                        {page.settings?.contact_address ??
                                            'Dushanbe, Republic of Tajikistan'}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 shrink-0 text-[var(--gov-blue)]" />
                                    <span>
                                        {page.settings?.contact_phone ??
                                            '+992 (000) 000-000'}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 shrink-0 text-[var(--gov-blue)]" />
                                    <span>
                                        {page.settings?.contact_email ??
                                            'info@example.tj'}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
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

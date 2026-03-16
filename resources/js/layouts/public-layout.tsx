import { Head, Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Menu,
    X,
    Search,
    MessageCircle,
    Facebook,
    Twitter,
    Youtube,
    Accessibility,
    Phone,
    Mail,
    MapPin,
} from 'lucide-react';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About PIC', href: '/about' },
    { label: 'The Project', href: '/project' },
    { label: 'Activities', href: '/activities' },
    { label: 'News', href: '/news' },
    { label: 'Procurement', href: '/procurement' },
    { label: 'Documents', href: '/documents' },
    { label: 'Media', href: '/media' },
    { label: 'Contact', href: '/contact' },
];

const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'tj', label: 'TJ' },
];

interface PublicLayoutProps extends PropsWithChildren {
    title?: string;
}

export default function PublicLayout({ children, title }: PublicLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const currentLocale = (usePage().props as any).locale ?? 'en';

    function switchLanguage(code: string) {
        window.location.href = `/language/${code}`;
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F4F6F9', color: '#1A1A2E' }}>
            {title && <Head title={`${title} | PIC TDFP`} />}

            {/* Top Bar */}
            <div style={{ backgroundColor: '#1B3A6B' }} className="w-full">
                <div className="container mx-auto px-4">
                    <div className="flex h-9 items-center justify-between">
                        <span className="text-xs text-blue-200 hidden sm:block">
                            Republic of Tajikistan &nbsp;|&nbsp; Ministry of Digital Development
                        </span>
                        <span className="text-xs text-blue-200 sm:hidden">Republic of Tajikistan</span>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-300 hover:text-white transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-300 hover:text-white transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-300 hover:text-white transition-colors"
                                aria-label="YouTube"
                            >
                                <Youtube className="h-3.5 w-3.5" />
                            </a>
                            <span className="text-blue-600">|</span>
                            <button className="text-blue-300 hover:text-white transition-colors" aria-label="Accessibility options">
                                <Accessibility className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-md border-b-2" style={{ borderBottomColor: '#C4922A' }}>
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 shrink-0">
                            <div
                                className="flex h-11 w-11 items-center justify-center rounded-lg shrink-0"
                                style={{ backgroundColor: '#1B3A6B' }}
                            >
                                <span className="text-sm font-bold text-white leading-tight text-center">PIC</span>
                            </div>
                            <div className="hidden sm:flex flex-col leading-tight">
                                <span className="text-sm font-bold" style={{ color: '#1B3A6B' }}>
                                    Projects Implementation Center
                                </span>
                                <span className="text-xs text-gray-500">Tajikistan Digital Foundations Project</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="rounded px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap"
                                    style={{ color: '#1A1A2E' }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.color = '#1B3A6B';
                                        (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F6F9';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.color = '#1A1A2E';
                                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Language Switcher */}
                            <div className="hidden sm:flex items-center border rounded overflow-hidden" style={{ borderColor: '#d1d5db' }}>
                                {languages.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => switchLanguage(l.code)}
                                        className="px-2.5 py-1 text-xs font-semibold transition-colors"
                                        style={
                                            currentLocale === l.code
                                                ? { backgroundColor: '#1B3A6B', color: '#FFFFFF' }
                                                : { backgroundColor: 'transparent', color: '#1B3A6B' }
                                        }
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <Button variant="ghost" size="icon" asChild className="text-gray-600 hover:text-blue-700">
                                <Link href="/search">
                                    <Search className="h-4 w-4" />
                                </Link>
                            </Button>

                            {/* GRM Button */}
                            <Button
                                asChild
                                size="sm"
                                className="hidden sm:flex items-center gap-1.5 font-semibold text-white"
                                style={{ backgroundColor: '#C4922A' }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = '#a97820';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = '#C4922A';
                                }}
                            >
                                <Link href="/grm/submit">
                                    <MessageCircle className="h-4 w-4" />
                                    Submit Complaint
                                </Link>
                            </Button>

                            {/* Mobile toggle */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="xl:hidden p-2 rounded transition-colors"
                                style={{ color: '#1B3A6B' }}
                                aria-label="Toggle menu"
                            >
                                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav */}
                {mobileOpen && (
                    <div className="xl:hidden border-t bg-white">
                        <nav className="container mx-auto px-4 py-3 space-y-0.5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block rounded px-3 py-2 text-sm font-medium transition-colors"
                                    style={{ color: '#1A1A2E' }}
                                    onClick={() => setMobileOpen(false)}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F6F9';
                                        (e.currentTarget as HTMLElement).style.color = '#1B3A6B';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                        (e.currentTarget as HTMLElement).style.color = '#1A1A2E';
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Mobile Language Switcher */}
                            <div className="flex items-center gap-2 px-3 pt-3 pb-1">
                                <span className="text-xs text-gray-500 font-medium">Language:</span>
                                {languages.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => switchLanguage(l.code)}
                                        className="px-2.5 py-1 text-xs font-semibold rounded transition-colors border"
                                        style={
                                            currentLocale === l.code
                                                ? { backgroundColor: '#1B3A6B', color: '#FFFFFF', borderColor: '#1B3A6B' }
                                                : { backgroundColor: 'transparent', color: '#1B3A6B', borderColor: '#1B3A6B' }
                                        }
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>

                            {/* Mobile GRM */}
                            <Link
                                href="/grm/submit"
                                className="flex items-center justify-center gap-2 rounded px-3 py-2.5 text-sm font-semibold text-white mt-2"
                                style={{ backgroundColor: '#C4922A' }}
                                onClick={() => setMobileOpen(false)}
                            >
                                <MessageCircle className="h-4 w-4" />
                                Submit Complaint
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer style={{ backgroundColor: '#1B3A6B' }} className="text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Column 1: Logo + Description */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-lg shrink-0"
                                    style={{ backgroundColor: '#C4922A' }}
                                >
                                    <span className="text-sm font-bold text-white">PIC</span>
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-bold text-white">Projects Implementation Center</span>
                                    <span className="text-xs text-blue-300">TDFP</span>
                                </div>
                            </div>
                            <p className="text-sm text-blue-200 leading-relaxed">
                                The Projects Implementation Center oversees the Tajikistan Digital Foundations Project,
                                strengthening digital infrastructure, e-government services, and digital skills across Tajikistan.
                            </p>
                        </div>

                        {/* Column 2: Navigation */}
                        <div>
                            <h3 className="mb-4 text-sm font-bold text-white uppercase tracking-wider">Navigation</h3>
                            <ul className="space-y-2">
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-blue-200 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Resources */}
                        <div>
                            <h3 className="mb-4 text-sm font-bold text-white uppercase tracking-wider">Resources</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/documents" className="text-sm text-blue-200 hover:text-white transition-colors">
                                        Document Repository
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/procurement" className="text-sm text-blue-200 hover:text-white transition-colors">
                                        Procurement Notices
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/media" className="text-sm text-blue-200 hover:text-white transition-colors">
                                        Media Gallery
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/grm" className="text-sm text-blue-200 hover:text-white transition-colors">
                                        Grievance Redress (GRM)
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/grm/submit" className="text-sm text-blue-200 hover:text-white transition-colors">
                                        Submit Complaint
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/grm/track" className="text-sm text-blue-200 hover:text-white transition-colors">
                                        Track a Case
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Contact */}
                        <div>
                            <h3 className="mb-4 text-sm font-bold text-white uppercase tracking-wider">Contact Us</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-blue-300 mt-0.5 shrink-0" />
                                    <span className="text-sm text-blue-200">
                                        Dushanbe, Republic of Tajikistan
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-blue-300 shrink-0" />
                                    <a href="mailto:info@pic.tj" className="text-sm text-blue-200 hover:text-white transition-colors">
                                        info@pic.tj
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-blue-300 shrink-0" />
                                    <span className="text-sm text-blue-200">+992 (37) 000-0000</span>
                                </li>
                            </ul>
                            <div className="mt-5">
                                <Link
                                    href="/grm/submit"
                                    className="inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-white transition-colors w-full justify-center"
                                    style={{ backgroundColor: '#C4922A' }}
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Submit Complaint
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Bar */}
                <div style={{ backgroundColor: '#122951' }} className="border-t border-blue-900">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-400">
                            <p>
                                &copy; {new Date().getFullYear()} Projects Implementation Center. Tajikistan Digital Foundations Project. All rights reserved.
                            </p>
                            <p className="flex items-center gap-1">
                                Funded by{' '}
                                <a
                                    href="https://worldbank.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-300 hover:text-white transition-colors font-semibold"
                                >
                                    World Bank
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

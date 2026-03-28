import { Link, usePage } from '@inertiajs/react';
import { Home } from 'lucide-react';

import PublicLayout from '@/layouts/public-layout';
import { t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';

export default function NotFound() {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const homeHref = localizedPublicHref('/', locale, defaultLocale);

    return (
        <PublicLayout title={t(locale, 'error.404.title')}>
            <div className="gov-container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
                <p className="text-8xl font-bold tracking-tight text-[var(--public-accent)] opacity-20 select-none">
                    404
                </p>
                <h1 className="mt-4 text-2xl font-semibold text-[var(--public-primary)]">
                    {t(locale, 'error.404.title')}
                </h1>
                <p className="mt-3 max-w-md text-base text-slate-500">
                    {t(locale, 'error.404.description')}
                </p>
                <Link
                    href={homeHref}
                    className="mt-8 inline-flex items-center gap-2 rounded-md bg-[var(--public-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--public-accent)]/90"
                >
                    <Home className="h-4 w-4" />
                    {t(locale, 'error.404.backHome')}
                </Link>
            </div>
        </PublicLayout>
    );
}

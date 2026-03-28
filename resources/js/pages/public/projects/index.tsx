import { Link, usePage } from '@inertiajs/react';
import { Calendar, DollarSign } from 'lucide-react';

import PageHero from '@/components/page-hero';
import PublicLayout from '@/layouts/public-layout';
import { t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';

const PROJECTS = [
    {
        slug: 'tdfp',
        href: '/projects/tdfp',
        titleKey: 'site.project' as const,
        funding: '$45.4M',
        period: '2025–2030',
    },
] as const;

export default function ProjectsIndex() {
    const sharedPage = usePage().props as any;
    const locale = sharedPage.locale ?? 'en';
    const defaultLocale = sharedPage.localization?.default_locale ?? 'en';

    return (
        <PublicLayout
            title={t(locale, 'projects.title')}
            description={t(locale, 'projects.description')}
            blendHeader
        >
            <PageHero
                title={t(locale, 'projects.title')}
                subtitle={t(locale, 'nav.projects')}
                description={t(locale, 'projects.description')}
                compact
                breadcrumbs={[
                    { label: t(locale, 'nav.home'), href: localizedPublicHref('/', locale, defaultLocale) },
                    { label: t(locale, 'projects.title') },
                ]}
            />

            <div className="container mx-auto px-4 py-10">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {PROJECTS.map((project) => (
                        <Link
                            key={project.slug}
                            href={project.href}
                            className="gov-panel flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex flex-1 flex-col p-6">
                                <h3 className="text-base font-semibold text-[var(--public-primary-hover)] leading-snug">
                                    {t(locale, project.titleKey)}
                                </h3>
                                <div className="mt-4 flex flex-col gap-2 text-sm text-slate-500">
                                    <span className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 shrink-0 text-slate-400" />
                                        {project.funding}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                                        {project.period}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}

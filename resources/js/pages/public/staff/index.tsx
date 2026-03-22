import PageHero from '@/components/page-hero';
import PublicImage from '@/components/public-image';
import PublicLayout from '@/layouts/public-layout';
import { getTranslation, t } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Mail, Phone } from 'lucide-react';

interface StaffMemberNode {
    id: number;
    parent_id: number | null;
    email: string | null;
    phone: string | null;
    photo_url: string | null;
    is_leadership: boolean;
    translations: Array<{
        language: string;
        full_name: string;
        job_title: string;
        department?: string | null;
        biography?: string | null;
    }>;
    children: StaffMemberNode[];
}

function StaffNode({ member, locale, level = 0 }: { member: StaffMemberNode; locale: string; level?: number }) {
    const translation = getTranslation(member, locale);

    return (
        <li className="space-y-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="shrink-0">
                        {member.photo_url ? (
                            <PublicImage
                                src={member.photo_url}
                                alt={translation.full_name}
                                className="h-24 w-24 rounded-2xl object-cover"
                                sizes="96px"
                            />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--gov-mist)] text-2xl font-semibold text-[var(--gov-blue)]">
                                {translation.full_name.slice(0, 1)}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold text-[var(--gov-navy-strong)]">
                                {translation.full_name}
                            </h2>
                            {member.is_leadership && (
                                <span className="rounded-full bg-[var(--gov-mist)] px-2.5 py-1 text-xs font-semibold text-[var(--gov-blue)]">
                                    Leadership
                                </span>
                            )}
                        </div>
                        <p className="mt-1 font-medium text-slate-700">{translation.job_title}</p>
                        {translation.department && (
                            <p className="mt-1 text-sm text-slate-500">{translation.department}</p>
                        )}
                        {translation.biography && (
                            <p className="mt-4 text-sm leading-6 text-slate-600">{translation.biography}</p>
                        )}

                        {(member.email || member.phone) && (
                            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                                {member.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-[var(--gov-blue)]" aria-hidden="true" />
                                        <a href={`mailto:${member.email}`} className="hover:underline">
                                            {member.email}
                                        </a>
                                    </div>
                                )}
                                {member.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-[var(--gov-blue)]" aria-hidden="true" />
                                        <span>{member.phone}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </article>

            {member.children.length > 0 && (
                <ol className={`space-y-4 ${level === 0 ? 'pl-0' : 'pl-6'}`}>
                    {member.children.map((child) => (
                        <StaffNode key={child.id} member={child} locale={locale} level={level + 1} />
                    ))}
                </ol>
            )}
        </li>
    );
}

export default function PublicStaffIndex({
    staffHierarchy,
}: {
    staffHierarchy: StaffMemberNode[];
}) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const defaultLocale = page.localization?.default_locale ?? 'en';
    const publicHref = (path: string) => localizedPublicHref(path, locale, defaultLocale);
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: t(locale, 'staff.title'),
        itemListElement: staffHierarchy.map((member, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: getTranslation(member, locale).full_name,
        })),
    };

    return (
        <PublicLayout
            title={t(locale, 'staff.title')}
            description={t(locale, 'staff.description')}
            structuredData={structuredData}
            seoType="website"
            blendHeader
        >
            <PageHero
                title={t(locale, 'staff.heading')}
                subtitle={t(locale, 'staff.title')}
                description={t(locale, 'staff.description')}
            >
                <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1 text-xs text-blue-200">
                        <Link href={publicHref('/')} className="hover:text-white transition-colors">
                            {t(locale, 'common.home')}
                        </Link>
                        <ChevronRight className="h-3 w-3" aria-hidden="true" />
                        <span className="text-white" aria-current="page">
                            {t(locale, 'staff.title')}
                        </span>
                </nav>
            </PageHero>

            <section className="container mx-auto px-4 py-12">
                {staffHierarchy.length > 0 ? (
                    <ol className="space-y-6">
                        {staffHierarchy.map((member) => (
                            <StaffNode key={member.id} member={member} locale={locale} />
                        ))}
                    </ol>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                        {t(locale, 'staff.empty')}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}

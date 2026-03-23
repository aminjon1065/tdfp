import PageHero from '@/components/page-hero';
import PublicLayout from '@/layouts/public-layout';
import SocialShare from '@/components/social-share';
import { getTranslation, t as translate } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

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
    previewMeta?: {
        label: string;
        description: string;
    };
}

export default function Page({ page, previewMeta }: Props) {
    const sharedPage = usePage().props as any;
    const locale = sharedPage.locale ?? 'en';
    const defaultLocale = sharedPage.localization?.default_locale ?? 'en';
    const currentUrl = sharedPage.ziggy?.location ?? '';
    const publicHref = (path: string) => localizedPublicHref(path, locale, defaultLocale);

    if (! page) {
        return (
            <PublicLayout title={translate(locale, 'common.notFound')}>
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - {translate(locale, 'common.notFound')}</h1>
                    <p className="text-gray-500 mb-8">{translate(locale, 'common.notFoundDescription')}</p>
                    <Link href={publicHref('/')} className="inline-flex items-center gap-1 text-sm font-medium text-[var(--public-primary)] hover:underline">
                        {translate(locale, 'common.returnHome')}
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    const pageTranslation = getTranslation(page, locale);
    const pageTitle = pageTranslation.meta_title ?? pageTranslation.title ?? translate(locale, 'page.title');
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTranslation.title ?? pageTitle,
            description: pageTranslation.meta_description ?? undefined,
            inLanguage: locale,
            url: currentUrl || undefined,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: translate(locale, 'common.home'),
                    item: currentUrl ? new URL('/', currentUrl).toString() : undefined,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: pageTranslation.title ?? pageTitle,
                    item: currentUrl || undefined,
                },
            ],
        },
    ];

    return (
        <PublicLayout
            title={pageTitle}
            description={pageTranslation.meta_description}
            structuredData={structuredData}
            seoType="website"
            blendHeader
        >
            {previewMeta && (
                <div className="border-b border-amber-200 bg-amber-50">
                    <div className="container mx-auto px-4 py-3 text-sm text-amber-950">
                        <p className="font-semibold">{previewMeta.label}</p>
                        <p className="mt-1 text-amber-800">{previewMeta.description}</p>
                    </div>
                </div>
            )}
            <PageHero title={pageTranslation.title}>
                <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-blue-200">
                    <Link href={publicHref('/')} className="transition-colors hover:text-white">
                        {translate(locale, 'common.home')}
                    </Link>
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                    <span className="text-white" aria-current="page">{pageTranslation.title}</span>
                </nav>
            </PageHero>

            <article className="container mx-auto max-w-4xl px-4 py-12">
                {pageTranslation.content ? (
                    <>
                        <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: pageTranslation.content }} />
                        <SocialShare
                            className="mt-8"
                            title={pageTranslation.title ?? pageTitle}
                            url={currentUrl}
                            description={pageTranslation.meta_description}
                        />
                    </>
                ) : (
                    <p className="text-gray-500">{translate(locale, 'common.noContent')}</p>
                )}
            </article>
        </PublicLayout>
    );
}

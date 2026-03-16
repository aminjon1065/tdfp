import PublicLayout from '@/layouts/public-layout';
import { getTranslation, t as translate } from '@/lib/i18n';
import { Head, Link, usePage } from '@inertiajs/react';
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
}

export default function Page({ page }: Props) {
    const locale = (usePage().props as any).locale ?? 'en';

    if (! page) {
        return (
            <PublicLayout title={translate(locale, 'common.notFound')}>
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - {translate(locale, 'common.notFound')}</h1>
                    <p className="text-gray-500 mb-8">{translate(locale, 'common.notFoundDescription')}</p>
                    <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium hover:underline" style={{ color: '#1B3A6B' }}>
                        {translate(locale, 'common.returnHome')}
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    const pageTranslation = getTranslation(page, locale);
    const pageTitle = pageTranslation.meta_title ?? pageTranslation.title ?? translate(locale, 'page.title');

    return (
        <PublicLayout title={pageTitle}>
            {pageTranslation.meta_title && <Head title={`${pageTranslation.meta_title} | PIC TDFP`} />}
            {pageTranslation.meta_description && (
                <Head>
                    <meta name="description" content={pageTranslation.meta_description} />
                </Head>
            )}

            <div style={{ backgroundColor: '#1B3A6B' }} className="py-8">
                <div className="container mx-auto px-4">
                    <nav className="mb-2 flex items-center gap-1 text-xs text-blue-300">
                        <Link href="/" className="hover:text-white transition-colors">
                            {translate(locale, 'common.home')}
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-white">{pageTranslation.title}</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">{pageTranslation.title}</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {pageTranslation.content ? (
                    <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: pageTranslation.content }} />
                ) : (
                    <p className="text-gray-500">{translate(locale, 'common.noContent')}</p>
                )}
            </div>
        </PublicLayout>
    );
}

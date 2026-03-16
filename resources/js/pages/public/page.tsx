import PublicLayout from '@/layouts/public-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { getTranslation } from '@/lib/i18n';
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

    if (!page) {
        return (
            <PublicLayout title="Page Not Found">
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404 – Page Not Found</h1>
                    <p className="text-gray-500 mb-8">The page you are looking for does not exist or has been removed.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                        style={{ color: '#1B3A6B' }}
                    >
                        Return to Homepage
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    const t = getTranslation(page, locale);
    const pageTitle = t.meta_title ?? t.title ?? 'Page';

    return (
        <PublicLayout title={pageTitle}>
            {t.meta_title && <Head title={`${t.meta_title} | PIC TDFP`} />}
            {t.meta_description && (
                <Head>
                    <meta name="description" content={t.meta_description} />
                </Head>
            )}

            {/* Breadcrumb */}
            <div style={{ backgroundColor: '#1B3A6B' }} className="py-8">
                <div className="container mx-auto px-4">
                    <nav className="mb-2 flex items-center gap-1 text-xs text-blue-300">
                        <Link href="/" className="hover:text-white transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-white">{t.title}</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">{t.title}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {t.content ? (
                    <div
                        className="prose prose-lg max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: t.content }}
                    />
                ) : (
                    <p className="text-gray-500">No content available for this page.</p>
                )}
            </div>
        </PublicLayout>
    );
}

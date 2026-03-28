import { Head, Link, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    FileText,
    FolderKanban,
    Megaphone,
    ShieldCheck,
} from 'lucide-react';

import PageHero from '@/components/page-hero';
import SocialShare from '@/components/social-share';
import PublicLayout from '@/layouts/public-layout';
import { getTranslation, t as translate } from '@/lib/i18n';
import { localizedPublicHref } from '@/lib/public-locale';

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

const contentByLocale = {
    en: {
        title: 'About Us',
        subtitle: 'Projects Implementation Center',
        description:
            'The center coordinates delivery, governance, procurement transparency, and communication for the Tajikistan Digital Foundations Project.',
        intro: 'This page is guaranteed by the application code, so it remains available even if the CMS entry is missing. When the CMS page exists, its editable content is still shown below.',
        highlights: [
            {
                title: 'Program coordination',
                description:
                    'Coordinate implementation streams and keep delivery aligned with approved objectives.',
                icon: FolderKanban,
            },
            {
                title: 'Transparent procurement',
                description:
                    'Publish procurement opportunities, updates, and supporting documents for public access.',
                icon: FileText,
            },
            {
                title: 'Public communication',
                description:
                    'Share updates, activities, and official announcements through the website.',
                icon: Megaphone,
            },
            {
                title: 'Accountability',
                description:
                    'Support grievance handling, public visibility, and operational oversight.',
                icon: ShieldCheck,
            },
        ],
    },
    ru: {
        title: 'О нас',
        subtitle: 'Центр реализации проектов',
        description:
            'Центр координирует реализацию, управление, прозрачность закупок и коммуникацию по Проекту цифровых основ Таджикистана.',
        intro: 'Эта страница гарантирована кодом приложения, поэтому она доступна даже если запись в CMS отсутствует. Если страница в CMS существует, ее редактируемый контент также показывается ниже.',
        highlights: [
            {
                title: 'Координация программы',
                description:
                    'Координация потоков реализации и соответствие утвержденным целям проекта.',
                icon: FolderKanban,
            },
            {
                title: 'Прозрачные закупки',
                description:
                    'Публикация закупок, обновлений и сопроводительных документов для открытого доступа.',
                icon: FileText,
            },
            {
                title: 'Публичная коммуникация',
                description:
                    'Публикация новостей, мероприятий и официальных объявлений на сайте.',
                icon: Megaphone,
            },
            {
                title: 'Подотчетность',
                description:
                    'Поддержка механизма обращений, публичной прозрачности и операционного контроля.',
                icon: ShieldCheck,
            },
        ],
    },
    tj: {
        title: 'Дар бораи мо',
        subtitle: 'Маркази татбиқи лоиҳаҳо',
        description:
            'Марказ ҳамоҳангсозии татбиқ, идоракунӣ, шаффофияти харид ва иртиботро барои Лоиҳаи асосҳои рақамии Тоҷикистон иҷро мекунад.',
        intro: 'Ин саҳифа аз тарафи худи код кафолат дода мешавад, бинобар ин ҳатто агар сабти CMS вуҷуд надошта бошад ҳам, он дастрас мемонад. Агар саҳифа дар CMS мавҷуд бошад, муҳтавои таҳриршавандаи он низ дар поён намоиш дода мешавад.',
        highlights: [
            {
                title: 'Ҳамоҳангсозии барнома',
                description:
                    'Ҳамоҳангсозии самтҳои татбиқ ва мутобиқ нигоҳ доштани иҷро бо ҳадафҳои тасдиқшуда.',
                icon: FolderKanban,
            },
            {
                title: 'Хариди шаффоф',
                description:
                    'Нашри имкониятҳои харид, навсозиҳо ва ҳуҷҷатҳои дахлдор барои дастрасии умум.',
                icon: FileText,
            },
            {
                title: 'Иртиботи оммавӣ',
                description:
                    'Нашри навсозиҳо, фаъолиятҳо ва эълонҳои расмӣ тавассути сомона.',
                icon: Megaphone,
            },
            {
                title: 'Ҳисоботдиҳӣ',
                description:
                    'Дастгирии коркарди муроҷиатҳо, шаффофияти оммавӣ ва назорати амалиётӣ.',
                icon: ShieldCheck,
            },
        ],
    },
} as const;

export default function About({ page }: Props) {
    const sharedPage = usePage().props as any;
    const locale = sharedPage.locale ?? 'en';
    const defaultLocale = sharedPage.localization?.default_locale ?? 'en';
    const currentUrl = sharedPage.ziggy?.location ?? '';
    const publicHref = (path: string) =>
        localizedPublicHref(path, locale, defaultLocale);
    const fallback =
        contentByLocale[locale as keyof typeof contentByLocale] ??
        contentByLocale.en;
    const pageTranslation = page ? getTranslation(page, locale) : {};
    const pageTitle =
        pageTranslation.meta_title ?? pageTranslation.title ?? fallback.title;
    const pageDescription =
        pageTranslation.meta_description ?? fallback.description;

    return (
        <PublicLayout
            title={pageTitle}
            description={pageDescription}
            seoType="website"
            blendHeader
        >
            <Head title={`${pageTitle} | PIC TDFP`} />

            <PageHero
                title={fallback.title}
                subtitle={fallback.subtitle}
                description={fallback.description}
            >
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-1 text-xs text-blue-200"
                >
                    <Link
                        href={publicHref('/')}
                        className="transition-colors hover:text-white"
                    >
                        {translate(locale, 'common.home')}
                    </Link>
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                    <span className="text-white" aria-current="page">
                        {fallback.title}
                    </span>
                </nav>
            </PageHero>

            <section className="container mx-auto px-4 py-12">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl border border-[var(--public-border)] bg-white p-8 shadow-sm">
                        <p className="text-base leading-8 text-slate-600">
                            {fallback.intro}
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {fallback.highlights.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-3xl border border-[var(--public-border)] bg-[var(--public-surface)] p-6"
                            >
                                <item.icon className="h-5 w-5 text-[var(--public-accent)]" />
                                <h2 className="mt-4 text-lg font-semibold text-[var(--public-primary-hover)]">
                                    {item.title}
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {pageTranslation.content && (
                    <article className="mt-10 rounded-3xl border border-[var(--public-border)] bg-white p-8 shadow-sm">
                        <div
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: pageTranslation.content,
                            }}
                        />
                        <SocialShare
                            className="mt-8"
                            title={pageTranslation.title ?? fallback.title}
                            url={currentUrl}
                            description={pageDescription}
                        />
                    </article>
                )}
            </section>
        </PublicLayout>
    );
}

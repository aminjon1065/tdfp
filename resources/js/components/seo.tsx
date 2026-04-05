import { Head } from '@inertiajs/react';

interface SeoProps {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    siteName?: string;
    imageUrl?: string;
    type?: string;
    locale?: string;
    noIndex?: boolean;
    structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
    alternates?: Array<{
        hrefLang: string;
        href: string;
    }>;
}

const localeMap: Record<string, string> = {
    en: 'en_US',
    ru: 'ru_RU',
    tj: 'tg_TJ',
};

export default function Seo({
    title,
    description,
    canonicalUrl,
    siteName,
    imageUrl,
    type = 'website',
    locale = 'en',
    noIndex = false,
    structuredData,
    alternates = [],
}: SeoProps) {
    const metaTitle =
        title && siteName ? `${title} | ${siteName}` : (title ?? siteName);
    const schemas = Array.isArray(structuredData)
        ? structuredData
        : structuredData
          ? [structuredData]
          : [];

    return (
        <Head>
            {metaTitle && <title>{metaTitle}</title>}
            {description && (
                <meta
                    head-key="description"
                    name="description"
                    content={description}
                />
            )}
            {canonicalUrl && (
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={canonicalUrl}
                />
            )}
            {alternates.map((alternate) => (
                <link
                    key={`${alternate.hrefLang}:${alternate.href}`}
                    head-key={`alternate:${alternate.hrefLang}`}
                    rel="alternate"
                    hrefLang={alternate.hrefLang}
                    href={alternate.href}
                />
            ))}
            {noIndex && (
                <meta
                    head-key="robots"
                    name="robots"
                    content="noindex,nofollow"
                />
            )}
            {metaTitle && (
                <meta
                    head-key="og:title"
                    property="og:title"
                    content={metaTitle}
                />
            )}
            {description && (
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={description}
                />
            )}
            {canonicalUrl && (
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={canonicalUrl}
                />
            )}
            {imageUrl && (
                <meta
                    head-key="og:image"
                    property="og:image"
                    content={imageUrl}
                />
            )}
            <meta head-key="og:type" property="og:type" content={type} />
            {siteName && (
                <meta
                    head-key="og:site_name"
                    property="og:site_name"
                    content={siteName}
                />
            )}
            <meta
                head-key="og:locale"
                property="og:locale"
                content={localeMap[locale] ?? localeMap.en}
            />
            <meta
                head-key="twitter:card"
                name="twitter:card"
                content="summary_large_image"
            />
            {metaTitle && (
                <meta
                    head-key="twitter:title"
                    name="twitter:title"
                    content={metaTitle}
                />
            )}
            {description && (
                <meta
                    head-key="twitter:description"
                    name="twitter:description"
                    content={description}
                />
            )}
            {imageUrl && (
                <meta
                    head-key="twitter:image"
                    name="twitter:image"
                    content={imageUrl}
                />
            )}
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema),
                    }}
                />
            ))}
        </Head>
    );
}

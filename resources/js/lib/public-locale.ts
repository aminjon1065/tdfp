export function publicLocaleQuery(
    locale: string,
    defaultLocale: string,
): Record<string, string> {
    if (locale === defaultLocale) {
        return {};
    }

    return {
        lang: locale,
    };
}

export function localizedPublicHref(
    path: string,
    locale: string,
    defaultLocale: string,
): string {
    if (locale === defaultLocale) {
        return path;
    }

    const [pathname, queryString = ''] = path.split('?', 2);
    const searchParams = new URLSearchParams(queryString);

    searchParams.set('lang', locale);

    const nextQuery = searchParams.toString();

    return nextQuery === '' ? pathname : `${pathname}?${nextQuery}`;
}

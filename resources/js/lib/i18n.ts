/**
 * Get a translation for a given item by locale.
 * Falls back to first available translation if locale not found.
 */
export function getTranslation(item: any, locale: string = 'en'): Record<string, any> {
    if (!item?.translations?.length) return {};
    return (
        item.translations.find((t: any) => t.language === locale) ??
        item.translations[0] ??
        {}
    );
}

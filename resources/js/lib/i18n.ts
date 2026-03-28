import en from '../locales/en';
import ru from '../locales/ru';
import tj from '../locales/tj';

export type SupportedLocale = 'en' | 'ru' | 'tj';

const dateLocales: Record<SupportedLocale, string> = {
    en: 'en-US',
    ru: 'ru-RU',
    tj: 'tg-TJ',
};

const messages: Record<SupportedLocale, Record<string, string>> = {
    en,
    ru,
    tj,
};

export function normalizeLocale(locale?: string): SupportedLocale {
    if (locale === 'ru' || locale === 'tj') {
        return locale;
    }

    return 'en';
}

export function t(locale: string, key: string, fallback?: string): string {
    const normalizedLocale = normalizeLocale(locale);

    return (
        messages[normalizedLocale][key] ?? messages.en[key] ?? fallback ?? key
    );
}

export function formatLocalizedDate(
    value: string | Date | null | undefined,
    locale: string,
): string {
    if (!value) {
        return '';
    }

    const normalizedLocale = normalizeLocale(locale);

    return new Date(value).toLocaleDateString(dateLocales[normalizedLocale]);
}

export function formatLocalizedDateTime(
    value: string | Date | null | undefined,
    locale: string,
): string {
    if (!value) {
        return '';
    }

    const normalizedLocale = normalizeLocale(locale);

    return new Date(value).toLocaleString(dateLocales[normalizedLocale]);
}

export function getStatusLabel(
    status: string | null | undefined,
    locale: string,
): string {
    if (!status) {
        return '';
    }

    return t(locale, `status.${status}`, status.replaceAll('_', ' '));
}

export function getProcurementProcessLabel(
    processState: string | null | undefined,
    locale: string,
): string {
    if (!processState) {
        return '';
    }

    return t(
        locale,
        `procurement.processState.${processState}`,
        processState.replaceAll('_', ' '),
    );
}

export function getTranslation(
    item: any,
    locale: string = 'en',
): Record<string, any> {
    if (!item?.translations?.length) {
        return {};
    }

    const normalizedLocale = normalizeLocale(locale);

    return (
        item.translations.find(
            (translation: any) => translation.language === normalizedLocale,
        ) ??
        item.translations[0] ??
        {}
    );
}

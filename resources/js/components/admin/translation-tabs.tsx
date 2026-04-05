import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { SupportedLocale, type SharedData } from '@/types';

const RichTextEditor = lazy(() =>
    import('@/components/admin/rich-text-editor').then((module) => ({
        default: module.RichTextEditor,
    })),
);

interface TranslationField {
    name: string;
    label: string;
    type: 'input' | 'textarea' | 'richtext';
    required?: boolean;
}

interface TranslationTabsProps {
    fields: TranslationField[];
    data: Record<string, Record<string, string>>;
    onChange: (lang: SupportedLocale, field: string, value: string) => void;
    errors?: Record<string, string>;
}

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'tj', label: 'Тоҷикӣ' },
];

export function TranslationTabs({
    fields,
    data,
    onChange,
    errors = {},
}: TranslationTabsProps) {
    const [activeLanguage, setActiveLanguage] = useState<SupportedLocale>('en');
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    // Проверка наличия ошибок в конкретной локали
    const hasLocaleErrors = (langCode: string) => {
        return Object.keys(errors).some((key) =>
            key.startsWith(`translations.${langCode}`),
        );
    };

    // Проверка заполненности обязательных полей в локали
    const isLocaleComplete = (langCode: string) => {
        return fields
            .filter((f) => f.required)
            .every((f) => data[langCode]?.[f.name]?.trim().length > 0);
    };

    return (
        <div className="space-y-4">
            <div className="flex w-fit gap-1 rounded-xl border bg-muted/30 p-1.5">
                {LANGUAGES.map((lang) => {
                    const hasError = hasLocaleErrors(lang.code);
                    const isComplete = isLocaleComplete(lang.code);
                    const isActive = activeLanguage === lang.code;

                    return (
                        <button
                            key={lang.code}
                            type="button"
                            onClick={() =>
                                setActiveLanguage(lang.code as SupportedLocale)
                            }
                            className={cn(
                                'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                                'hover:bg-background/50',
                                isActive
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {lang.label}

                            {/* Индикаторы состояния */}
                            <div className="flex items-center">
                                {hasError ? (
                                    <AlertCircle className="h-3.5 w-3.5 animate-pulse text-destructive" />
                                ) : isComplete ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                    <Circle className="h-3.5 w-3.5 text-slate-300" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {LANGUAGES.map((lang) => (
                <div
                    key={lang.code}
                    data-lang-panel={lang.code}
                    className={cn(
                        'space-y-6 rounded-xl border bg-card p-6 shadow-xs transition-opacity duration-200',
                        activeLanguage !== lang.code && 'hidden opacity-0',
                    )}
                >
                    <div className="mb-2 flex items-center gap-2">
                        <span className="rounded bg-muted px-2 py-0.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            {lang.label} Content
                        </span>
                    </div>

                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <Label
                                htmlFor={`${lang.code}-${field.name}`}
                                className="flex items-center justify-between text-sm font-semibold"
                            >
                                <span>
                                    {field.label}
                                    {field.required && (
                                        <span className="ml-1 text-destructive">
                                            *
                                        </span>
                                    )}
                                </span>

                                {errors[
                                    `translations.${lang.code}.${field.name}`
                                ] && (
                                    <span className="text-[10px] font-bold text-destructive uppercase">
                                        Error
                                    </span>
                                )}
                            </Label>

                            {field.type === 'textarea' ? (
                                <textarea
                                    id={`${lang.code}-${field.name}`}
                                    value={data[lang.code]?.[field.name] ?? ''}
                                    onChange={(e) =>
                                        onChange(
                                            lang.code as SupportedLocale,
                                            field.name,
                                            e.target.value,
                                        )
                                    }
                                    rows={4}
                                    className={cn(
                                        'flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                                        errors[
                                            `translations.${lang.code}.${field.name}`
                                        ] &&
                                            'border-destructive/50 ring-destructive/20',
                                    )}
                                />
                            ) : field.type === 'richtext' ? (
                                <Suspense
                                    fallback={
                                        <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-input bg-muted/20 text-sm text-muted-foreground">
                                            <span className="animate-pulse">
                                                {t(
                                                    locale,
                                                    'admin.form.loadingEditor',
                                                )}
                                            </span>
                                        </div>
                                    }
                                >
                                    <RichTextEditor
                                        id={`${lang.code}-${field.name}`}
                                        value={
                                            data[lang.code]?.[field.name] ?? ''
                                        }
                                        onChange={(value) =>
                                            onChange(
                                                lang.code as SupportedLocale,
                                                field.name,
                                                value,
                                            )
                                        }
                                    />
                                </Suspense>
                            ) : (
                                <Input
                                    id={`${lang.code}-${field.name}`}
                                    value={data[lang.code]?.[field.name] ?? ''}
                                    onChange={(e) =>
                                        onChange(
                                            lang.code as SupportedLocale,
                                            field.name,
                                            e.target.value,
                                        )
                                    }
                                    className={cn(
                                        'h-11 rounded-lg',
                                        errors[
                                            `translations.${lang.code}.${field.name}`
                                        ] &&
                                            'border-destructive/50 ring-destructive/20',
                                    )}
                                />
                            )}

                            {errors[
                                `translations.${lang.code}.${field.name}`
                            ] && (
                                <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-destructive">
                                    <AlertCircle className="h-3 w-3" />
                                    {
                                        errors[
                                            `translations.${lang.code}.${field.name}`
                                        ]
                                    }
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

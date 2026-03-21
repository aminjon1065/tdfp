import { lazy, Suspense, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SupportedLocale } from '@/types';

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

export function TranslationTabs({ fields, data, onChange, errors = {} }: TranslationTabsProps) {
    const [activeLanguage, setActiveLanguage] = useState<SupportedLocale>('en');

    return (
        <div className="space-y-2">
            <div className="flex gap-1 rounded-lg border p-1 w-fit">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.code}
                        type="button"
                        className="rounded px-3 py-1 text-sm transition-colors hover:bg-muted data-[active=true]:bg-background data-[active=true]:shadow-sm"
                        data-active={activeLanguage === lang.code ? 'true' : 'false'}
                        onClick={() => setActiveLanguage(lang.code as SupportedLocale)}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
            {LANGUAGES.map((lang) => (
                <div
                    key={lang.code}
                    data-lang-panel={lang.code}
                    hidden={activeLanguage !== lang.code}
                    aria-hidden={activeLanguage !== lang.code}
                    className="space-y-4 rounded-lg border p-4"
                >
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-1">
                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor={`${lang.code}-${field.name}`}>
                                    {field.label}
                                    {field.required && (
                                        <span className="text-destructive ml-1">*</span>
                                    )}
                                </Label>
                            </div>

                            {field.type === 'textarea' ? (
                                <textarea
                                    id={`${lang.code}-${field.name}`}
                                    value={data[lang.code]?.[field.name] ?? ''}
                                    onChange={(e) => onChange(lang.code as SupportedLocale, field.name, e.target.value)}
                                    rows={4}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            ) : field.type === 'richtext' ? (
                                <Suspense
                                    fallback={
                                        <div className="min-h-[220px] rounded-md border border-input bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                                            Loading editor...
                                        </div>
                                    }
                                >
                                    <RichTextEditor
                                        id={`${lang.code}-${field.name}`}
                                        value={data[lang.code]?.[field.name] ?? ''}
                                        onChange={(value) =>
                                            onChange(
                                                lang.code as SupportedLocale,
                                                field.name,
                                                value,
                                            )}
                                    />
                                </Suspense>
                            ) : (
                                <Input
                                    id={`${lang.code}-${field.name}`}
                                    value={data[lang.code]?.[field.name] ?? ''}
                                    onChange={(e) => onChange(lang.code as SupportedLocale, field.name, e.target.value)}
                                />
                            )}
                            {errors[`translations.${lang.code}.${field.name}`] && (
                                <p className="text-sm text-destructive">
                                    {errors[`translations.${lang.code}.${field.name}`]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

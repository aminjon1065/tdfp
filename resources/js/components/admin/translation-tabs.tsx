import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TranslationField {
    name: string;
    label: string;
    type: 'input' | 'textarea' | 'richtext';
    required?: boolean;
}

interface TranslationTabsProps {
    fields: TranslationField[];
    data: Record<string, Record<string, string>>;
    onChange: (lang: string, field: string, value: string) => void;
    errors?: Record<string, string>;
}

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'tj', label: 'Тоҷикӣ' },
];

export function TranslationTabs({ fields, data, onChange, errors = {} }: TranslationTabsProps) {
    const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>, langCode: string) => {
        const parent = e.currentTarget.parentElement!;
        parent.querySelectorAll('button').forEach((b) => b.setAttribute('data-active', 'false'));
        e.currentTarget.setAttribute('data-active', 'true');
        const allPanels = document.querySelectorAll('[data-lang-panel]');
        allPanels.forEach((p) => ((p as HTMLElement).style.display = 'none'));
        const panel = document.querySelector(`[data-lang-panel="${langCode}"]`);
        if (panel) (panel as HTMLElement).style.display = 'block';
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-1 rounded-lg border p-1 w-fit">
                {LANGUAGES.map((lang, idx) => (
                    <button
                        key={lang.code}
                        type="button"
                        className="rounded px-3 py-1 text-sm transition-colors hover:bg-muted data-[active=true]:bg-background data-[active=true]:shadow-sm"
                        data-active={idx === 0 ? 'true' : 'false'}
                        onClick={(e) => handleTabClick(e, lang.code)}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
            {LANGUAGES.map((lang, idx) => (
                <div
                    key={lang.code}
                    data-lang-panel={lang.code}
                    style={{ display: idx === 0 ? 'block' : 'none' }}
                    className="space-y-4 rounded-lg border p-4"
                >
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-1">
                            <Label htmlFor={`${lang.code}-${field.name}`}>
                                {field.label}
                                {field.required && (
                                    <span className="text-destructive ml-1">*</span>
                                )}
                            </Label>
                            {field.type === 'textarea' || field.type === 'richtext' ? (
                                <textarea
                                    id={`${lang.code}-${field.name}`}
                                    value={data[lang.code]?.[field.name] ?? ''}
                                    onChange={(e) => onChange(lang.code, field.name, e.target.value)}
                                    rows={field.type === 'richtext' ? 10 : 4}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            ) : (
                                <Input
                                    id={`${lang.code}-${field.name}`}
                                    value={data[lang.code]?.[field.name] ?? ''}
                                    onChange={(e) => onChange(lang.code, field.name, e.target.value)}
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

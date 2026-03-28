import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { useBVI } from '@/providers/bvi-provider';
import { usePage } from '@inertiajs/react';
import { RotateCcw, Image as ImageIcon, ImageOff, AlignLeft, X, Volume2, VolumeX } from 'lucide-react';

const TTS_LANG: Record<string, string> = {
    ru: 'ru-RU',
    en: 'en-US',
    tj: 'tg-TJ',
};

export function BVIPanel() {
    const { state, setState } = useBVI();
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'ru';

    // TTS: speak hovered/focused elements when enabled
    useEffect(() => {
        if (!state.enabled || state.tts !== 'on') {
            window.speechSynthesis?.cancel();
            return;
        }

        const lang = TTS_LANG[locale] ?? 'ru-RU';
        let lastText = '';

        const speak = (text: string) => {
            const clean = text.trim().replace(/\s+/g, ' ').slice(0, 300);
            if (!clean || clean === lastText) return;
            lastText = clean;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(clean);
            utterance.lang = lang;
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const el = e.target as HTMLElement;
            const target = el.closest(
                'a, button, [role="button"], p, h1, h2, h3, h4, h5, h6, li, td, th, label, [aria-label], input, select, textarea',
            ) as HTMLElement | null;
            if (!target) return;
            const text =
                target.getAttribute('aria-label') ||
                (target as HTMLImageElement).alt ||
                target.getAttribute('title') ||
                target.textContent ||
                '';
            speak(text);
        };

        const handleMouseOut = () => {
            lastText = '';
            window.speechSynthesis.cancel();
        };

        const handleFocus = (e: FocusEvent) => {
            const el = e.target as HTMLElement;
            const text =
                el.getAttribute('aria-label') ||
                (el as HTMLInputElement).placeholder ||
                el.getAttribute('title') ||
                el.textContent ||
                '';
            speak(text);
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('focusin', handleFocus);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('focusin', handleFocus);
            window.speechSynthesis?.cancel();
        };
    }, [state.enabled, state.tts, locale]);

    if (!state.enabled) return null;

    const resetSettings = () => {
        setState({
            enabled: true,
            fontSize: 'normal',
            contrast: 'default',
            lineHeight: 'normal',
            images: 'on',
            tts: 'off',
        });
    };

    return (
        <div
            role="toolbar"
            aria-label={t(locale, 'bvi.panel')}
            className="bvi-panel w-full border-b bg-background p-3"
        >
            <div className="gov-container flex flex-wrap items-center gap-3">

                {/* Font size */}
                <div className="flex items-center gap-1.5 border-r border-border pr-3">
                    {(['normal', 'large', 'xlarge'] as const).map((size) => (
                        <Button
                            key={size}
                            variant={state.fontSize === size ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 w-10 p-0"
                            onClick={() => setState((s) => ({ ...s, fontSize: size }))}
                            aria-pressed={state.fontSize === size}
                        >
                            <span className={size === 'normal' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-lg font-bold'}>A</span>
                        </Button>
                    ))}
                </div>

                {/* Contrast */}
                <div className="flex items-center gap-1.5 border-r border-border pr-3">
                    <Button
                        variant={state.contrast === 'default' ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => setState((s) => ({ ...s, contrast: 'default' }))}
                        aria-pressed={state.contrast === 'default'}
                    >
                        {t(locale, 'bvi.contrastStandard')}
                    </Button>
                    <Button
                        variant={state.contrast === 'high' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                            'h-8 px-3',
                            state.contrast !== 'high' && 'bg-black text-white hover:bg-black/90',
                        )}
                        onClick={() => setState((s) => ({ ...s, contrast: 'high' }))}
                        aria-pressed={state.contrast === 'high'}
                    >
                        {t(locale, 'bvi.contrastHigh')}
                    </Button>
                </div>

                {/* Extra options */}
                <div className="flex items-center gap-1.5 border-r border-border pr-3">
                    <Button
                        variant={state.lineHeight === 'wide' ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => setState((s) => ({ ...s, lineHeight: s.lineHeight === 'wide' ? 'normal' : 'wide' }))}
                        aria-pressed={state.lineHeight === 'wide'}
                    >
                        <AlignLeft className="mr-1.5 h-4 w-4" />
                        {t(locale, 'bvi.lineHeight')}
                    </Button>

                    <Button
                        variant={state.images === 'off' ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => setState((s) => ({ ...s, images: s.images === 'on' ? 'off' : 'on' }))}
                        aria-pressed={state.images === 'off'}
                    >
                        {state.images === 'on'
                            ? <ImageIcon className="mr-1.5 h-4 w-4" />
                            : <ImageOff className="mr-1.5 h-4 w-4" />
                        }
                        {state.images === 'on' ? t(locale, 'bvi.imagesOn') : t(locale, 'bvi.imagesOff')}
                    </Button>
                </div>

                {/* TTS */}
                <Button
                    variant={state.tts === 'on' ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setState((s) => ({ ...s, tts: s.tts === 'on' ? 'off' : 'on' }))}
                    aria-pressed={state.tts === 'on'}
                >
                    {state.tts === 'on'
                        ? <Volume2 className="mr-1.5 h-4 w-4" />
                        : <VolumeX className="mr-1.5 h-4 w-4" />
                    }
                    {t(locale, 'bvi.tts')}
                </Button>

                <div className="flex-1" />

                {/* Panel controls */}
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                        onClick={resetSettings}
                        aria-label={t(locale, 'bvi.reset')}
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => setState((s) => ({ ...s, enabled: false }))}
                    >
                        <X className="mr-1.5 h-4 w-4" />
                        {t(locale, 'bvi.close')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

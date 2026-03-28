import { usePage } from '@inertiajs/react';
import { MousePointerClick, MicOff, Volume2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { useBVI } from '@/providers/bvi-provider';

const LANG_MAP: Record<string, string> = {
    en: 'en-US',
    ru: 'ru-RU',
    tj: 'tg-TJ',
};

/** Selectors for interactive elements that should be read on first click */
const INTERACTIVE = 'a, button, input, select, textarea, [role="button"], [role="link"], [role="menuitem"], label';

function PanelBtn({
    active,
    onClick,
    children,
    className,
}: {
    active?: boolean;
    onClick: () => void;
    children: ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'inline-flex h-7 items-center rounded border px-2.5 text-xs font-semibold transition-colors',
                active
                    ? 'border-yellow-400 bg-yellow-400 text-slate-900'
                    : 'border-slate-500 bg-slate-700 text-white hover:border-slate-400 hover:bg-slate-600',
                className,
            )}
        >
            {children}
        </button>
    );
}

function getElementLabel(el: Element): string {
    return (
        el.getAttribute('aria-label') ||
        el.getAttribute('title') ||
        (el as HTMLElement).innerText?.trim() ||
        el.getAttribute('placeholder') ||
        el.getAttribute('value') ||
        el.getAttribute('alt') ||
        'Элемент'
    );
}

export function BVIPanel() {
    const { state, setState } = useBVI();
    const page = usePage<{ locale?: string }>();
    const locale = page.props.locale ?? 'ru';

    const [speaking, setSpeaking] = useState(false);
    const [voiceClicks, setVoiceClicks] = useState(false);
    const [ttsSupported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);

    /** Tracks the last element spoken via click-to-speak, and when */
    const lastClickRef = useRef<{ el: Element | null; time: number }>({ el: null, time: 0 });

    /* Click-to-speak interceptor — active only when voiceClicks is on */
    useEffect(() => {
        if (!voiceClicks || !ttsSupported) return;

        function handleClick(e: MouseEvent) {
            const target = e.target as Element;
            const interactive = target.closest(INTERACTIVE);
            if (!interactive) return;

            /* Never intercept clicks on the BVI panel itself */
            if (interactive.closest('[data-bvi-panel]')) return;

            const now = Date.now();
            const { el, time } = lastClickRef.current;
            const isSameRecent = el === interactive && now - time < 3500;

            if (isSameRecent) {
                /* Second click on the same element — execute the action */
                lastClickRef.current = { el: null, time: 0 };
                return;
            }

            /* First click — read aloud, block the action */
            e.preventDefault();
            e.stopPropagation();

            lastClickRef.current = { el: interactive, time: now };

            const label = getElementLabel(interactive);
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(label);
            utt.lang = LANG_MAP[locale] ?? 'ru-RU';
            utt.rate = 1.0;
            window.speechSynthesis.speak(utt);
        }

        document.addEventListener('click', handleClick, true);
        return () => {
            document.removeEventListener('click', handleClick, true);
            lastClickRef.current = { el: null, time: 0 };
        };
    }, [voiceClicks, ttsSupported, locale]);

    /* Cancel speech when panel unmounts */
    useEffect(() => {
        return () => {
            window.speechSynthesis?.cancel();
        };
    }, []);

    function togglePageRead() {
        if (!ttsSupported) return;

        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }

        const text = document.getElementById('main-content')?.innerText?.trim() ?? '';
        if (!text) return;

        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = LANG_MAP[locale] ?? 'ru-RU';
        utt.rate = 0.95;
        utt.onend = () => setSpeaking(false);
        utt.onerror = () => setSpeaking(false);
        setSpeaking(true);
        window.speechSynthesis.speak(utt);
    }

    function handleClose() {
        window.speechSynthesis?.cancel();
        setSpeaking(false);
        setVoiceClicks(false);
        setState({ ...state, enabled: false });
    }

    if (!state.enabled) return null;

    return (
        /* Fixed strip below the nav header (utility bar 2.25rem + nav 3.5rem = 5.75rem) */
        <div
            data-bvi-panel
            className="fixed inset-x-0 z-30 border-b border-slate-700 bg-slate-900 shadow-lg"
            style={{ top: 'calc(2.25rem + 3.5rem)' }}
        >
            <div className="gov-container">
                <div className="flex flex-wrap items-center gap-1.5 py-2">
                    {/* Font size */}
                    <span className="mr-1 text-[10px] font-medium tracking-wide text-slate-400 uppercase">Размер</span>
                    <PanelBtn active={state.fontSize === 'normal'} onClick={() => setState((s) => ({ ...s, fontSize: 'normal' }))}>A</PanelBtn>
                    <PanelBtn active={state.fontSize === 'large'} onClick={() => setState((s) => ({ ...s, fontSize: 'large' }))}>A+</PanelBtn>
                    <PanelBtn active={state.fontSize === 'xlarge'} onClick={() => setState((s) => ({ ...s, fontSize: 'xlarge' }))}>A++</PanelBtn>

                    <span className="mx-1 h-4 w-px bg-slate-600" />

                    {/* Contrast */}
                    <span className="mr-1 text-[10px] font-medium tracking-wide text-slate-400 uppercase">Контраст</span>
                    <PanelBtn active={state.contrast === 'default'} onClick={() => setState((s) => ({ ...s, contrast: 'default' }))}>Обычный</PanelBtn>
                    <PanelBtn active={state.contrast === 'high'} onClick={() => setState((s) => ({ ...s, contrast: 'high' }))}>Чёрный</PanelBtn>
                    <PanelBtn active={state.contrast === 'invert'} onClick={() => setState((s) => ({ ...s, contrast: 'invert' }))}>Инверсия</PanelBtn>

                    <span className="mx-1 h-4 w-px bg-slate-600" />

                    {/* Images */}
                    <PanelBtn onClick={() => setState((s) => ({ ...s, images: s.images === 'on' ? 'off' : 'on' }))}>
                        {state.images === 'on' ? 'Скрыть изображения' : 'Показать изображения'}
                    </PanelBtn>

                    {ttsSupported && (
                        <>
                            <span className="mx-1 h-4 w-px bg-slate-600" />

                            {/* Voice — read full page */}
                            <span className="mr-1 text-[10px] font-medium tracking-wide text-slate-400 uppercase">Голос</span>
                            <PanelBtn
                                active={speaking}
                                onClick={togglePageRead}
                                className={speaking ? 'animate-pulse border-green-400 bg-green-600 text-white hover:bg-green-500' : ''}
                            >
                                {speaking ? (
                                    <>
                                        <MicOff className="mr-1 h-3 w-3" />
                                        Стоп
                                    </>
                                ) : (
                                    <>
                                        <Volume2 className="mr-1 h-3 w-3" />
                                        Читать
                                    </>
                                )}
                            </PanelBtn>

                            {/* Voice — click to speak mode */}
                            <PanelBtn
                                active={voiceClicks}
                                onClick={() => setVoiceClicks((v) => !v)}
                                className={voiceClicks ? 'animate-pulse border-blue-400 bg-blue-600 text-white hover:bg-blue-500' : ''}
                            >
                                <MousePointerClick className="mr-1 h-3 w-3" />
                                {voiceClicks ? 'Клики: Вкл' : 'Клики'}
                            </PanelBtn>
                        </>
                    )}

                    <div className="flex-1" />

                    {/* Close */}
                    <PanelBtn
                        onClick={handleClose}
                        className="border-slate-500 bg-transparent text-slate-300 hover:border-red-400 hover:bg-red-900/40 hover:text-red-300"
                    >
                        ✕ Закрыть
                    </PanelBtn>
                </div>
            </div>
        </div>
    );
}

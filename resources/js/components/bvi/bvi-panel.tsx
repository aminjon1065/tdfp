import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useBVI } from '@/providers/bvi-provider';

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

export function BVIPanel() {
    const { state, setState } = useBVI();

    if (!state.enabled) return null;

    return (
        /* Fixed strip below the nav header (utility bar 2.25rem + nav 3.5rem = 5.75rem) */
        <div className="fixed inset-x-0 z-30 border-b border-slate-700 bg-slate-900 shadow-lg" style={{ top: 'calc(2.25rem + 3.5rem)' }}>
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

                    <div className="flex-1" />

                    {/* Close */}
                    <PanelBtn
                        onClick={() => setState({ ...state, enabled: false })}
                        className="border-slate-500 bg-transparent text-slate-300 hover:border-red-400 hover:bg-red-900/40 hover:text-red-300"
                    >
                        ✕ Закрыть
                    </PanelBtn>
                </div>
            </div>
        </div>
    );
}

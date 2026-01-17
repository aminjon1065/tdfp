// src/providers/bvi-provider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

import { BVIState } from '@/types/bvi-types';

const DEFAULT_STATE: BVIState = {
    enabled: false,
    fontSize: 'normal',
    contrast: 'default',
    lineHeight: 'normal',
    images: 'on',
};

const BVIContext = createContext<{
    state: BVIState;
    setState: React.Dispatch<React.SetStateAction<BVIState>>;
} | null>(null);

export function BVIProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<BVIState>(() => {
        const saved = localStorage.getItem('bvi');
        return saved ? JSON.parse(saved) : DEFAULT_STATE;
    });

    useEffect(() => {
        localStorage.setItem('bvi', JSON.stringify(state));

        const html = document.documentElement;

        html.dataset.bvi = state.enabled ? 'on' : 'off';
        html.dataset.fontSize = state.fontSize;
        html.dataset.contrast = state.contrast;
        html.dataset.lineHeight = state.lineHeight;
        html.dataset.images = state.images;
    }, [state]);

    return (
        <BVIContext.Provider value={{ state, setState }}>
            {children}
        </BVIContext.Provider>
    );
}

export function useBVI() {
    const ctx = useContext(BVIContext);
    if (!ctx) {
        throw new Error('useBVI must be used inside BVIProvider');
    }
    return ctx;
}

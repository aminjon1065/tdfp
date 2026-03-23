import { type ReactNode } from 'react';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    description?: string;
    children?: ReactNode;
    compact?: boolean;
}

export default function PageHero({
    title,
    subtitle,
    description,
    children,
    compact = false,
}: PageHeroProps) {
    return (
        <section className="bg-[var(--public-primary)] pt-16 text-white">
            <div
                className={`mx-auto max-w-7xl px-6 ${compact ? 'py-12 md:py-14' : 'py-14 md:py-18'}`}
            >
                {children && <div className="mb-3">{children}</div>}
                {subtitle && (
                    <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-[var(--public-accent)] uppercase">
                        {subtitle}
                    </p>
                )}
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {title}
                </h1>
                {description && (
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">
                        {description}
                    </p>
                )}
            </div>
        </section>
    );
}

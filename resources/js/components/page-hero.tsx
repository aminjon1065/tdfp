import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { type ReactNode } from 'react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeroProps {
    title: string;
    subtitle?: string;
    description?: string;
    children?: ReactNode;
    compact?: boolean;
    breadcrumbs?: BreadcrumbItem[];
}

export default function PageHero({
    title,
    description,
    children,
    compact = false,
    breadcrumbs,
}: PageHeroProps) {
    return (
        <section className="bg-(--public-primary) pt-16 text-white">
            <div
                className={`mx-auto max-w-7xl px-6 ${compact ? 'py-12 md:py-14' : 'py-14 md:py-18'}`}
            >
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav aria-label="Breadcrumb" className="mb-4">
                        <ol className="flex flex-wrap items-center gap-1 text-xs text-white/50">
                            {breadcrumbs.map((crumb, i) => (
                                <li key={i} className="flex items-center gap-1">
                                    {i > 0 && (
                                        <ChevronRight className="h-3 w-3 shrink-0" />
                                    )}
                                    {crumb.href ? (
                                        <Link
                                            href={crumb.href}
                                            className="transition-colors hover:text-white/80"
                                        >
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="text-white/80">
                                            {crumb.label}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}
                {children && <div className="mb-3">{children}</div>}
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

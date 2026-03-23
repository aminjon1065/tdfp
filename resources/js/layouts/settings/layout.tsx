import { type PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useActiveUrl } from '@/hooks/use-active-url';
import AdminLayout from '@/layouts/admin-layout';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { type BreadcrumbItem, type NavItem } from '@/types';

const settingsNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: null,
    },
    {
        title: 'Two-Factor Auth',
        href: show(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

interface SettingsLayoutProps extends PropsWithChildren {
    title: string;
    description: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default function SettingsLayout({
    children,
    title,
    description,
    breadcrumbs = [],
}: SettingsLayoutProps) {
    const { urlIsActive } = useActiveUrl();

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="flex w-full flex-col gap-8">
                <Heading title={title} description={description} />

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
                    <aside className="w-full max-w-xl lg:w-56">
                        <nav className="flex flex-col gap-1" aria-label="Settings">
                            {settingsNavItems.map((item, index) => (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        'bg-muted': urlIsActive(item.href),
                                    })}
                                >
                                    <Link href={item.href}>{item.title}</Link>
                                </Button>
                            ))}
                        </nav>
                    </aside>

                    <Separator className="lg:hidden" />

                    <section className="max-w-2xl flex-1 space-y-8">
                        {children}
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}

import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Bell,
    FileText,
    FolderOpen,
    Image,
    LayoutDashboard,
    MessageCircle,
    Network,
    Newspaper,
    ScrollText,
    Settings,
    ShoppingBag,
    Users,
} from 'lucide-react';

import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { t } from '@/lib/i18n';
import { type SharedData } from '@/types';

const navItems = [
    { titleKey: 'admin.nav.dashboard', href: '/admin', icon: LayoutDashboard },
    { titleKey: 'admin.nav.pages', href: '/admin/pages', icon: FileText },
    { titleKey: 'admin.nav.news', href: '/admin/news', icon: Newspaper },
    {
        titleKey: 'admin.nav.activities',
        href: '/admin/activities',
        icon: Activity,
    },
    {
        titleKey: 'admin.nav.documents',
        href: '/admin/documents',
        icon: FolderOpen,
    },
    {
        titleKey: 'admin.nav.procurement',
        href: '/admin/procurement',
        icon: ShoppingBag,
    },
    { titleKey: 'admin.nav.media', href: '/admin/media', icon: Image },
    {
        titleKey: 'admin.nav.staff',
        href: '/admin/staff-members',
        icon: Network,
    },
    {
        titleKey: 'admin.nav.subscriptions',
        href: '/admin/subscriptions',
        icon: Bell,
    },
    { titleKey: 'admin.nav.grm', href: '/admin/grm', icon: MessageCircle },
    { titleKey: 'admin.nav.users', href: '/admin/users', icon: Users },
    { titleKey: 'admin.nav.settings', href: '/admin/settings', icon: Settings },
    {
        titleKey: 'admin.nav.auditLogs',
        href: '/admin/audit-logs',
        icon: ScrollText,
    },
];

export function AdminSidebar() {
    const { url, props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                        <span className="text-sm font-bold text-primary-foreground">
                            PIC
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                            {t(locale, 'admin.brand')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            TDFP
                        </span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {t(locale, 'admin.navigation')}
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        item.href === '/admin'
                                            ? url === '/admin'
                                            : url.startsWith(item.href)
                                    }
                                >
                                    <Link href={item.href}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{t(locale, item.titleKey)}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

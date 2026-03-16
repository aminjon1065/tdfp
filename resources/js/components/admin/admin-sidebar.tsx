import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/nav-user';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    Newspaper,
    Activity,
    FolderOpen,
    ShoppingBag,
    Image,
    MessageCircle,
    Users,
    Settings,
    ScrollText,
} from 'lucide-react';

const navItems = [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { title: 'Pages', href: '/admin/pages', icon: FileText },
    { title: 'News', href: '/admin/news', icon: Newspaper },
    { title: 'Activities', href: '/admin/activities', icon: Activity },
    { title: 'Documents', href: '/admin/documents', icon: FolderOpen },
    { title: 'Procurement', href: '/admin/procurement', icon: ShoppingBag },
    { title: 'Media', href: '/admin/media', icon: Image },
    { title: 'GRM Cases', href: '/admin/grm', icon: MessageCircle },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Settings', href: '/admin/settings', icon: Settings },
    { title: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
];

export function AdminSidebar() {
    const { url } = usePage();

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                        <span className="text-sm font-bold text-primary-foreground">PIC</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">PIC Admin</span>
                        <span className="text-xs text-muted-foreground">TDFP</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
                                        <span>{item.title}</span>
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

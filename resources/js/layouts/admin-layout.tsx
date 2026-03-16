import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

interface AdminLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({ children, breadcrumbs = [] }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="flex flex-1 flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
                    <SidebarTrigger />
                    {breadcrumbs.length > 0 && (
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    )}
                </header>
                <div className="flex-1 p-6">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}

import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    locale?: SupportedLocale;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type SupportedLocale = 'en' | 'ru' | 'tj';

export interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export interface Translation {
    language: string;
    title: string;
    summary?: string | null;
    content?: string | null;
    description?: string | null;
}

export interface NewsItem {
    id: number;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    featured_image: string | null;
    published_at: string | null;
    created_at: string;
    category?: { id: number; name: string } | null;
    translations: Translation[];
}

export interface GrmCase {
    id: number;
    ticket_number: string;
    complainant_name: string;
    email: string;
    phone: string | null;
    category: 'procurement' | 'project_implementation' | 'environment_social' | 'corruption' | 'other';
    status: 'submitted' | 'under_review' | 'investigation' | 'resolved' | 'closed';
    assigned_to: number | null;
    created_at: string;
    updated_at: string;
}

export interface AuditLogEntry {
    id: number;
    user_id: number | null;
    action: 'created' | 'updated' | 'deleted' | 'login' | 'logout';
    entity_type: string | null;
    entity_id: number | null;
    metadata: Record<string, unknown> | null;
    ip_address: string | null;
    created_at: string;
    user: Pick<User, 'id' | 'name'> | null;
}

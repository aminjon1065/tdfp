import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { formatLocalizedDate, getTranslation, t } from '@/lib/i18n';
import { NewsItem, Paginator, type SharedData } from '@/types';

interface NewsCategory {
    id: number;
    name: string;
}

interface Props {
    news: Paginator<NewsItem>;
    categories: NewsCategory[];
    filters: { search?: string; category_id?: number };
}

export default function AdminNewsIndex({ news }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    const columns = [
        {
            key: 'title',
            header: t(locale, 'common.title'),
            render: (row: NewsItem) =>
                getTranslation(row, locale).title ??
                t(locale, 'admin.content.untitled'),
        },
        {
            key: 'category',
            header: t(locale, 'common.category'),
            render: (row: any) => row.category?.name ?? '—',
        },
        {
            key: 'status',
            header: t(locale, 'common.status'),
            render: (row: any) => <StatusBadge status={row.status} />,
        },
        {
            key: 'published_at',
            header: t(locale, 'admin.content.published'),
            render: (row: NewsItem) =>
                row.published_at
                    ? formatLocalizedDate(row.published_at, locale)
                    : '—',
        },
        {
            key: 'actions',
            header: t(locale, 'common.actions'),
            render: (row: NewsItem) => (
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/news/${row.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (
                                confirm(
                                    t(locale, 'admin.content.deleteArticle'),
                                )
                            ) {
                                router.delete(`/admin/news/${row.id}`);
                            }
                        }}
                    >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout
            breadcrumbs={[
                { title: t(locale, 'admin.content.news'), href: '/admin/news' },
            ]}
        >
            <Head title={t(locale, 'admin.content.news')} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {t(locale, 'admin.content.news')}
                    </h1>
                    <Button asChild>
                        <Link href="/admin/news/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t(locale, 'admin.content.addArticle')}
                        </Link>
                    </Button>
                </div>
                <DataTable
                    data={news}
                    columns={columns}
                    searchable
                    onSearch={(s) => router.get('/admin/news', { search: s })}
                />
            </div>
        </AdminLayout>
    );
}

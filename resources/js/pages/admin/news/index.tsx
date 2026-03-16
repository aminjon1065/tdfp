import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Props {
    news: any;
    categories: any[];
    filters: any;
}

export default function AdminNewsIndex({ news }: Props) {
    const columns = [
        {
            key: 'title',
            header: 'Title',
            render: (row: any) =>
                row.translations?.find((t: any) => t.language === 'en')?.title ?? 'Untitled',
        },
        {
            key: 'category',
            header: 'Category',
            render: (row: any) => row.category?.name ?? '—',
        },
        {
            key: 'status',
            header: 'Status',
            render: (row: any) => <StatusBadge status={row.status} />,
        },
        {
            key: 'published_at',
            header: 'Published',
            render: (row: any) =>
                row.published_at ? new Date(row.published_at).toLocaleDateString() : '—',
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row: any) => (
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
                            if (confirm('Delete this article?')) {
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
        <AdminLayout breadcrumbs={[{ title: 'News', href: '/admin/news' }]}>
            <Head title="News" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">News</h1>
                    <Button asChild>
                        <Link href="/admin/news/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Article
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

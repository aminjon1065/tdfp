import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Download } from 'lucide-react';

import { DataTable } from '@/components/admin/data-table';

interface SubscriberRow {
    id: number;
    email: string;
    status: string;
    locale: string;
    confirmed_at: string | null;
    unsubscribed_at: string | null;
}

export default function AdminSubscriptionsIndex({
    subscribers,
    filters,
}: {
    subscribers: any;
    filters: Record<string, string>;
}) {
    const columns = [
        {
            key: 'email',
            header: 'Email',
            render: (row: SubscriberRow) => row.email,
        },
        {
            key: 'status',
            header: 'Status',
            render: (row: SubscriberRow) => row.status,
        },
        {
            key: 'locale',
            header: 'Locale',
            render: (row: SubscriberRow) => row.locale.toUpperCase(),
        },
        {
            key: 'confirmed_at',
            header: 'Confirmed',
            render: (row: SubscriberRow) => row.confirmed_at ?? '—',
        },
    ];

    return (
        <AdminLayout breadcrumbs={[{ title: 'Subscriptions', href: '/admin/subscriptions' }]}>
            <Head title="Subscriptions" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Email Subscriptions</h1>
                        <p className="text-sm text-muted-foreground">
                            Review confirmed, pending, and unsubscribed recipients.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={`/admin/subscriptions/export?status=${filters.status ?? ''}&search=${filters.search ?? ''}`}>
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'active', 'unsubscribed'].map((status) => (
                        <Button
                            key={status}
                            variant={filters.status === status || (status === 'all' && !filters.status) ? 'default' : 'outline'}
                            onClick={() =>
                                router.get('/admin/subscriptions', {
                                    ...filters,
                                    status: status === 'all' ? undefined : status,
                                })
                            }
                        >
                            {status === 'all' ? 'All' : status}
                        </Button>
                    ))}
                </div>

                <DataTable
                    data={subscribers}
                    columns={columns}
                    searchable
                    onSearch={(search) => router.get('/admin/subscriptions', { ...filters, search })}
                />
            </div>
        </AdminLayout>
    );
}

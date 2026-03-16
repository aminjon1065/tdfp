import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Activity, FileText, MessageCircle, ShoppingBag } from 'lucide-react';
import { StatusBadge } from '@/components/admin/status-badge';

interface Props {
    stats: {
        news_count: number;
        documents_count: number;
        open_grm_cases: number;
        open_procurements: number;
    };
    recent_news: any[];
    recent_grm: any[];
    recent_logs: any[];
}

export default function AdminDashboard({ stats, recent_news, recent_grm }: Props) {
    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }]}>
            <Head title="Admin Dashboard" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Published News</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.news_count}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Documents</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.documents_count}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Open GRM Cases</CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.open_grm_cases}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Open Procurements</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.open_procurements}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent News</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recent_news.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <span className="text-sm truncate max-w-[200px]">
                                            {item.translations?.find((t: any) => t.language === 'en')?.title ?? 'Untitled'}
                                        </span>
                                        <StatusBadge status={item.status} />
                                    </div>
                                ))}
                                {recent_news.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No news yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent GRM Cases</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recent_grm.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">{item.ticket_number}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                                {item.complainant_name}
                                            </p>
                                        </div>
                                        <StatusBadge status={item.status} />
                                    </div>
                                ))}
                                {recent_grm.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No cases yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

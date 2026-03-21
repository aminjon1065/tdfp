import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Activity, AlertTriangle, CheckCircle2, FileText, MessageCircle, ShoppingBag } from 'lucide-react';
import { StatusBadge } from '@/components/admin/status-badge';

interface Props {
    stats: {
        news_count: number;
        documents_count: number;
        open_grm_cases: number;
        open_procurements: number;
    };
    operational_readiness: {
        completion_percentage: number;
        is_ready: boolean;
        missing_count: number;
        items: {
            key: string;
            label: string;
            is_complete: boolean;
            value: string | null;
        }[];
    };
    automated_checks: {
        passing_count: number;
        failing_count: number;
        items: {
            key: string;
            label: string;
            is_passing: boolean;
            issue_count: number;
            checked_count: number;
            summary: string;
        }[];
    };
    operational_audit: {
        completion_percentage: number;
        is_ready: boolean;
        missing_count: number;
        failing_checks_count: number;
    };
    recent_news: any[];
    recent_grm: any[];
    recent_logs: any[];
}

export default function AdminDashboard({
    stats,
    operational_readiness,
    automated_checks,
    operational_audit,
    recent_news,
    recent_grm,
}: Props) {
    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }]}>
            <Head title="Admin Dashboard" />
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <Badge variant={operational_audit.is_ready ? 'default' : 'outline'}>
                        Operations audit: {operational_audit.completion_percentage}% complete
                    </Badge>
                </div>

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

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle>Operational Readiness</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Launch ownership, support, reporting, and backup governance baseline.
                                </p>
                            </div>
                            <Badge variant={operational_readiness.is_ready ? 'default' : 'outline'}>
                                {operational_readiness.completion_percentage}% complete
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                                {operational_readiness.is_ready ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                )}
                                <div>
                                    <p className="text-sm font-medium">
                                        {operational_readiness.is_ready
                                            ? 'Operations baseline is configured.'
                                            : `${operational_readiness.missing_count} readiness item(s) still need owner values.`}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        This is a product-side governance check, not infrastructure evidence.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {operational_readiness.items.map((item) => (
                                    <div key={item.key} className="flex items-start justify-between gap-4 rounded-md border p-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium">{item.label}</p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {item.value || 'Not configured'}
                                            </p>
                                        </div>
                                        <Badge variant={item.is_complete ? 'default' : 'outline'}>
                                            {item.is_complete ? 'Ready' : 'Missing'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Automated Checks</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {automated_checks.items.map((item) => (
                                    <div key={item.key} className="rounded-md border p-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium">{item.label}</p>
                                                <p className="text-xs text-muted-foreground">{item.summary}</p>
                                            </div>
                                            <Badge variant={item.is_passing ? 'default' : 'outline'}>
                                                {item.is_passing ? 'Pass' : 'Fail'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
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
            </div>
        </AdminLayout>
    );
}

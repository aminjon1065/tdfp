import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslation, t } from '@/lib/i18n';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, AlertTriangle, CheckCircle2, FileText, MessageCircle, Newspaper, Plus, ShoppingBag, Upload, ScrollText } from 'lucide-react';
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
    recent_logs,
}: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    return (
        <AdminLayout breadcrumbs={[{ title: t(locale, 'admin.dashboard.title'), href: '/admin' }]}>
            <Head title={t(locale, 'admin.dashboard.pageTitle')} />
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold">{t(locale, 'admin.dashboard.title')}</h1>
                    <Badge variant={operational_audit.is_ready ? 'default' : 'outline'}>
                        {t(locale, 'admin.dashboard.operationsAudit')}: {operational_audit.completion_percentage}% {t(locale, 'admin.dashboard.complete')}
                    </Badge>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                        <Link href="/admin/news/create">
                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                            {t(locale, 'admin.nav.news')}
                        </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                        <Link href="/admin/documents/create">
                            <Upload className="mr-1.5 h-3.5 w-3.5" />
                            {t(locale, 'admin.nav.documents')}
                        </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                        <Link href="/admin/procurement/create">
                            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                            {t(locale, 'admin.nav.procurement')}
                        </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                        <Link href="/admin/grm">
                            <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                            {t(locale, 'admin.nav.grm')} {stats.open_grm_cases > 0 && `(${stats.open_grm_cases})`}
                        </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                        <Link href="/admin/activities/create">
                            <Newspaper className="mr-1.5 h-3.5 w-3.5" />
                            {t(locale, 'admin.nav.activities')}
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t(locale, 'admin.dashboard.publishedNews')}</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.news_count}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t(locale, 'admin.dashboard.documents')}</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.documents_count}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t(locale, 'admin.dashboard.openGrmCases')}</CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.open_grm_cases}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t(locale, 'admin.dashboard.openProcurements')}</CardTitle>
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
                                <CardTitle>{t(locale, 'admin.dashboard.operationalReadiness')}</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {t(locale, 'admin.dashboard.operationalReadinessDescription')}
                                </p>
                            </div>
                            <Badge variant={operational_readiness.is_ready ? 'default' : 'outline'}>
                                {operational_readiness.completion_percentage}% {t(locale, 'admin.dashboard.complete')}
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
                                            ? t(locale, 'admin.dashboard.operationsReady')
                                            : `${operational_readiness.missing_count} ${t(locale, 'admin.dashboard.operationsMissing')}`}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t(locale, 'admin.dashboard.operationsEvidenceNote')}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {operational_readiness.items.map((item) => (
                                    <div key={item.key} className="flex items-start justify-between gap-4 rounded-md border p-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium">{item.label}</p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {item.value || t(locale, 'admin.dashboard.notConfigured')}
                                            </p>
                                        </div>
                                        <Badge variant={item.is_complete ? 'default' : 'outline'}>
                                            {item.is_complete ? t(locale, 'admin.dashboard.ready') : t(locale, 'admin.dashboard.missing')}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t(locale, 'admin.dashboard.automatedChecks')}</CardTitle>
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
                                                {item.is_passing ? t(locale, 'admin.dashboard.pass') : t(locale, 'admin.dashboard.fail')}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t(locale, 'admin.dashboard.recentNews')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recent_news.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <span className="text-sm truncate max-w-[200px]">
                                            {getTranslation(item, locale).title ?? t(locale, 'common.untitled')}
                                        </span>
                                        <StatusBadge status={item.status} />
                                    </div>
                                ))}
                                {recent_news.length === 0 && (
                                    <p className="text-sm text-muted-foreground">{t(locale, 'admin.dashboard.noNews')}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t(locale, 'admin.dashboard.recentGrmCases')}</CardTitle>
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
                                        <p className="text-sm text-muted-foreground">{t(locale, 'admin.dashboard.noCases')}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent audit log */}
                {recent_logs && recent_logs.length > 0 && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <ScrollText className="h-4 w-4 text-muted-foreground" />
                                {t(locale, 'admin.nav.auditLogs')}
                            </CardTitle>
                            <Link href="/admin/audit-logs" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                                {t(locale, 'common.viewAll')}
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <ul className="divide-y text-sm">
                                {recent_logs.slice(0, 5).map((log: any) => (
                                    <li key={log.id} className="flex items-center justify-between gap-4 py-2">
                                        <div className="min-w-0">
                                            <span className="font-medium">{log.user?.name ?? t(locale, 'common.system')}</span>
                                            {' · '}
                                            <span className="text-muted-foreground">{log.action}</span>
                                            {' '}
                                            <span className="text-muted-foreground">{log.entity_type}</span>
                                        </div>
                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            {log.created_at ? new Date(log.created_at).toLocaleDateString() : ''}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}

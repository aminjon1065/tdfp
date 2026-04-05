import { Head, useForm, usePage } from '@inertiajs/react';
import { Clock, Download, Send } from 'lucide-react';

import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { formatLocalizedDate, t } from '@/lib/i18n';
import { type SharedData } from '@/types';

interface GrmMessage {
    id: number;
    sender_type: 'complainant' | 'officer';
    sender_name: string;
    message: string;
    created_at: string;
}

interface GrmStatusHistory {
    id: number;
    from_status: string | null;
    to_status: string;
    notes: string | null;
    changed_by: string;
    created_at: string;
}

interface GrmCase {
    id: number;
    ticket_number: string;
    complainant_name: string;
    complainant_email: string | null;
    complainant_phone: string | null;
    category: string | null;
    description: string;
    status: string;
    assigned_officer_id: number | null;
    assigned_officer: string | null;
    created_at: string;
    can_view_sensitive_data: boolean;
    can_update_status: boolean;
    can_message: boolean;
    messages: GrmMessage[];
    status_history: GrmStatusHistory[];
    attachments?: {
        id: number;
        original_name: string | null;
        uploaded_at: string;
    }[];
}

interface Props {
    case: GrmCase;
    officers: { id: number; name: string }[];
}

export default function AdminGrmShow({ case: grm, officers }: Props) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const messageForm = useForm({ message: '' });
    const statusForm = useForm({
        status: grm.status,
        officer_id: grm.assigned_officer_id
            ? String(grm.assigned_officer_id)
            : '',
        notes: '',
    });

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        messageForm.post(`/admin/grm/${grm.id}/messages`, {
            onSuccess: () => messageForm.reset(),
        });
    };

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        statusForm.post(`/admin/grm/${grm.id}/status`);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: t(locale, 'admin.content.grm'), href: '/admin/grm' },
                { title: grm.ticket_number, href: `/admin/grm/${grm.id}` },
            ]}
        >
            <Head
                title={`${t(locale, 'admin.content.grm')} ${grm.ticket_number}`}
            />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {grm.ticket_number}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t(locale, 'admin.form.submittedOn')}{' '}
                            {formatLocalizedDate(grm.created_at, locale)}
                        </p>
                    </div>
                    <StatusBadge status={grm.status} />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Complainant info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {t(locale, 'admin.content.complainant')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            {t(locale, 'common.name')}
                                        </p>
                                        <p className="text-sm font-medium">
                                            {grm.complainant_name}
                                        </p>
                                    </div>
                                    {grm.complainant_email && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t(locale, 'common.email')}
                                            </p>
                                            <p className="text-sm">
                                                {grm.complainant_email}
                                            </p>
                                        </div>
                                    )}
                                    {grm.complainant_phone && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t(locale, 'common.phone')}
                                            </p>
                                            <p className="text-sm">
                                                {grm.complainant_phone}
                                            </p>
                                        </div>
                                    )}
                                    {grm.category && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t(locale, 'common.category')}
                                            </p>
                                            <p className="text-sm">
                                                {grm.category}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {!grm.can_view_sensitive_data && (
                                    <p className="text-xs text-muted-foreground">
                                        {t(locale, 'admin.form.contactMasked')}
                                    </p>
                                )}
                                <Separator />
                                <div>
                                    <p className="mb-1 text-xs text-muted-foreground">
                                        {t(locale, 'common.descriptionLabel')}
                                    </p>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {grm.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Messages */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {t(locale, 'admin.form.messages')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {grm.messages.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        {t(locale, 'admin.form.noMessages')}
                                    </p>
                                )}
                                {grm.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 ${msg.sender_type === 'officer' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                msg.sender_type === 'officer'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {msg.sender_name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div
                                            className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                                                msg.sender_type === 'officer'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                            }`}
                                        >
                                            <p className="mb-1 text-xs font-medium">
                                                {msg.sender_name}
                                            </p>
                                            <p className="whitespace-pre-wrap">
                                                {msg.message}
                                            </p>
                                            <p
                                                className={`mt-1 text-xs ${
                                                    msg.sender_type ===
                                                    'officer'
                                                        ? 'text-primary-foreground/70'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {new Date(
                                                    msg.created_at,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <Separator />

                                {/* Send message form */}
                                {grm.can_message ? (
                                    <form
                                        onSubmit={handleSendMessage}
                                        className="flex gap-2"
                                    >
                                        <Input
                                            value={messageForm.data.message}
                                            onChange={(e) =>
                                                messageForm.setData(
                                                    'message',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={t(
                                                locale,
                                                'admin.form.typeMessage',
                                            )}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="submit"
                                            size="icon"
                                            disabled={messageForm.processing}
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </form>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            locale,
                                            'admin.form.messagingRestricted',
                                        )}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {t(locale, 'admin.form.attachments')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {!grm.can_view_sensitive_data ? (
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            locale,
                                            'admin.form.attachmentsRestricted',
                                        )}
                                    </p>
                                ) : !grm.attachments ||
                                  grm.attachments.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        {t(locale, 'admin.form.noAttachments')}
                                    </p>
                                ) : (
                                    grm.attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {attachment.original_name ??
                                                        `Attachment ${attachment.id}`}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t(locale, 'common.upload')}{' '}
                                                    {new Date(
                                                        attachment.uploaded_at,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <a
                                                    href={`/admin/grm/${grm.id}/attachments/${attachment.id}`}
                                                >
                                                    <Download className="mr-1.5 h-4 w-4" />
                                                    {t(
                                                        locale,
                                                        'admin.form.download',
                                                    )}
                                                </a>
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Update status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {t(locale, 'admin.form.updateStatus')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {grm.can_update_status ? (
                                    <form
                                        onSubmit={handleUpdateStatus}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="new_status">
                                                {t(locale, 'admin.form.status')}
                                            </Label>
                                            <select
                                                id="new_status"
                                                value={statusForm.data.status}
                                                onChange={(e) =>
                                                    statusForm.setData(
                                                        'status',
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            >
                                                <option value="submitted">
                                                    {t(
                                                        locale,
                                                        'status.submitted',
                                                    )}
                                                </option>
                                                <option value="under_review">
                                                    {t(
                                                        locale,
                                                        'status.under_review',
                                                    )}
                                                </option>
                                                <option value="investigation">
                                                    {t(
                                                        locale,
                                                        'status.investigation',
                                                    )}
                                                </option>
                                                <option value="resolved">
                                                    {t(
                                                        locale,
                                                        'status.resolved',
                                                    )}
                                                </option>
                                                <option value="closed">
                                                    {t(locale, 'status.closed')}
                                                </option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="officer">
                                                {t(
                                                    locale,
                                                    'admin.form.assignOfficer',
                                                )}
                                            </Label>
                                            <select
                                                id="officer"
                                                value={
                                                    statusForm.data.officer_id
                                                }
                                                onChange={(e) =>
                                                    statusForm.setData(
                                                        'officer_id',
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            >
                                                <option value="">
                                                    —{' '}
                                                    {t(
                                                        locale,
                                                        'admin.form.unassigned',
                                                    )}{' '}
                                                    —
                                                </option>
                                                {officers.map((o) => (
                                                    <option
                                                        key={o.id}
                                                        value={o.id}
                                                    >
                                                        {o.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="notes">
                                                {t(locale, 'common.notes')}
                                            </Label>
                                            <textarea
                                                id="notes"
                                                value={statusForm.data.notes}
                                                onChange={(e) =>
                                                    statusForm.setData(
                                                        'notes',
                                                        e.target.value,
                                                    )
                                                }
                                                rows={3}
                                                placeholder={t(
                                                    locale,
                                                    'admin.form.optionalNotes',
                                                )}
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={statusForm.processing}
                                        >
                                            {statusForm.processing
                                                ? t(
                                                      locale,
                                                      'admin.form.currentlyUpdating',
                                                  )
                                                : t(
                                                      locale,
                                                      'admin.form.updateStatus',
                                                  )}
                                        </Button>
                                    </form>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            locale,
                                            'admin.form.statusRestricted',
                                        )}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status history timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {t(locale, 'admin.form.statusHistory')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {grm.status_history.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        {t(locale, 'admin.form.noHistory')}
                                    </p>
                                )}
                                <div className="space-y-3">
                                    {grm.status_history.map((entry, i) => (
                                        <div
                                            key={entry.id}
                                            className="flex gap-3"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                </div>
                                                {i <
                                                    grm.status_history.length -
                                                        1 && (
                                                    <div className="mt-1 w-px flex-1 bg-border" />
                                                )}
                                            </div>
                                            <div className="pb-3">
                                                <div className="flex items-center gap-2">
                                                    {entry.from_status && (
                                                        <>
                                                            <StatusBadge
                                                                status={
                                                                    entry.from_status
                                                                }
                                                            />
                                                            <span className="text-xs text-muted-foreground">
                                                                →
                                                            </span>
                                                        </>
                                                    )}
                                                    <StatusBadge
                                                        status={entry.to_status}
                                                    />
                                                </div>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {t(locale, 'admin.form.by')}{' '}
                                                    {entry.changed_by} ·{' '}
                                                    {formatLocalizedDate(
                                                        entry.created_at,
                                                        locale,
                                                    )}
                                                </p>
                                                {entry.notes && (
                                                    <p className="mt-1 text-xs text-muted-foreground italic">
                                                        {entry.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

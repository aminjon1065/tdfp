import AdminLayout from '@/layouts/admin-layout';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Head, useForm } from '@inertiajs/react';
import { Download, Send, Clock } from 'lucide-react';

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
    attachments?: { id: number; original_name: string | null; uploaded_at: string }[];
}

interface Props {
    case: GrmCase;
    officers: { id: number; name: string }[];
}

export default function AdminGrmShow({ case: grm, officers }: Props) {
    const messageForm = useForm({ message: '' });
    const statusForm = useForm({
        status: grm.status,
        officer_id: grm.assigned_officer_id ? String(grm.assigned_officer_id) : '',
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
                { title: 'GRM Cases', href: '/admin/grm' },
                { title: grm.ticket_number, href: `/admin/grm/${grm.id}` },
            ]}
        >
            <Head title={`GRM Case ${grm.ticket_number}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{grm.ticket_number}</h1>
                        <p className="text-sm text-muted-foreground">
                            Submitted {new Date(grm.created_at).toLocaleDateString()}
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
                                <CardTitle className="text-base">Complainant Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Name</p>
                                        <p className="text-sm font-medium">{grm.complainant_name}</p>
                                    </div>
                                    {grm.complainant_email && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Email</p>
                                            <p className="text-sm">{grm.complainant_email}</p>
                                        </div>
                                    )}
                                    {grm.complainant_phone && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Phone</p>
                                            <p className="text-sm">{grm.complainant_phone}</p>
                                        </div>
                                    )}
                                    {grm.category && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Category</p>
                                            <p className="text-sm">{grm.category}</p>
                                        </div>
                                    )}
                                </div>
                                {!grm.can_view_sensitive_data && (
                                    <p className="text-xs text-muted-foreground">
                                        Contact details are masked for read-only GRM access.
                                    </p>
                                )}
                                <Separator />
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                                    <p className="text-sm whitespace-pre-wrap">{grm.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Messages */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Messages</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {grm.messages.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No messages yet.</p>
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
                                            {msg.sender_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div
                                            className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                                                msg.sender_type === 'officer'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                            }`}
                                        >
                                            <p className="font-medium text-xs mb-1">{msg.sender_name}</p>
                                            <p className="whitespace-pre-wrap">{msg.message}</p>
                                            <p
                                                className={`mt-1 text-xs ${
                                                    msg.sender_type === 'officer'
                                                        ? 'text-primary-foreground/70'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {new Date(msg.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <Separator />

                                {/* Send message form */}
                                {grm.can_message ? (
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <Input
                                            value={messageForm.data.message}
                                            onChange={(e) => messageForm.setData('message', e.target.value)}
                                            placeholder="Type a message…"
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
                                        Messaging is available only to GRM staff with operational permissions.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Attachments</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {!grm.can_view_sensitive_data ? (
                                    <p className="text-sm text-muted-foreground">
                                        Attachment downloads are restricted to GRM staff with operational permissions.
                                    </p>
                                ) : !grm.attachments || grm.attachments.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No attachments uploaded.</p>
                                ) : (
                                    grm.attachments.map((attachment) => (
                                        <div key={attachment.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {attachment.original_name ?? `Attachment ${attachment.id}`}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Uploaded {new Date(attachment.uploaded_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <Button asChild variant="outline" size="sm">
                                                <a href={`/admin/grm/${grm.id}/attachments/${attachment.id}`}>
                                                    <Download className="mr-1.5 h-4 w-4" />
                                                    Download
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
                                <CardTitle className="text-base">Update Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {grm.can_update_status ? (
                                    <form onSubmit={handleUpdateStatus} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new_status">Status</Label>
                                            <select
                                                id="new_status"
                                                value={statusForm.data.status}
                                                onChange={(e) => statusForm.setData('status', e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            >
                                                <option value="submitted">Submitted</option>
                                                <option value="under_review">Under Review</option>
                                                <option value="investigation">Investigation</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="officer">Assign Officer</Label>
                                            <select
                                                id="officer"
                                            value={statusForm.data.officer_id}
                                            onChange={(e) =>
                                                statusForm.setData('officer_id', e.target.value)
                                            }
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            >
                                                <option value="">— Unassigned —</option>
                                                {officers.map((o) => (
                                                    <option key={o.id} value={o.id}>
                                                        {o.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Notes</Label>
                                            <textarea
                                                id="notes"
                                                value={statusForm.data.notes}
                                                onChange={(e) => statusForm.setData('notes', e.target.value)}
                                                rows={3}
                                                placeholder="Optional notes for this status change…"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={statusForm.processing}>
                                            {statusForm.processing ? 'Updating…' : 'Update Status'}
                                        </Button>
                                    </form>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Status changes are restricted to GRM staff with operational permissions.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status history timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Status History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {grm.status_history.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No history yet.</p>
                                )}
                                <div className="space-y-3">
                                    {grm.status_history.map((entry, i) => (
                                        <div key={entry.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                </div>
                                                {i < grm.status_history.length - 1 && (
                                                    <div className="w-px flex-1 bg-border mt-1" />
                                                )}
                                            </div>
                                            <div className="pb-3">
                                                <div className="flex items-center gap-2">
                                                    {entry.from_status && (
                                                        <>
                                                            <StatusBadge status={entry.from_status} />
                                                            <span className="text-xs text-muted-foreground">→</span>
                                                        </>
                                                    )}
                                                    <StatusBadge status={entry.to_status} />
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    by {entry.changed_by} ·{' '}
                                                    {new Date(entry.created_at).toLocaleDateString()}
                                                </p>
                                                {entry.notes && (
                                                    <p className="text-xs mt-1 text-muted-foreground italic">
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

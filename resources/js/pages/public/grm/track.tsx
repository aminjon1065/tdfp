import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle, Clock } from 'lucide-react';

interface Props {
    case?: {
        ticket_number: string;
        status: string;
        created_at: string;
        statusHistory: { status: string; created_at: string }[];
    };
    notFound?: boolean;
    trackingExpired?: boolean;
}

export default function GrmTrack({ case: grmCase, notFound, trackingExpired }: Props) {
    const { data, setData, processing } = useForm({
        ticket_number: '',
        tracking_token: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/grm/track', data);
    };

    return (
        <PublicLayout title="Track Complaint">
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Track Your Complaint</h1>
                <p className="mb-8 text-gray-600">Enter your ticket number to check the current status of your complaint.</p>

                <form onSubmit={handleSearch} className="mb-8 flex gap-3">
                    <div className="grid flex-1 gap-3 sm:grid-cols-2">
                        <Input
                            value={data.ticket_number}
                            onChange={(e) => setData('ticket_number', e.target.value)}
                            placeholder="Ticket number"
                        />
                        <Input
                            value={data.tracking_token}
                            onChange={(e) => setData('tracking_token', e.target.value)}
                            placeholder="Tracking token"
                        />
                    </div>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Searching…' : 'Track'}
                    </Button>
                </form>

                {notFound && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        No complaint matched the ticket number and tracking token provided. Please check both values and try again.
                    </div>
                )}

                {trackingExpired && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        Public tracking for this closed complaint has expired. Please contact the GRM team if you need additional follow-up.
                    </div>
                )}

                {grmCase && (
                    <div className="space-y-4">
                        <div className="rounded-lg border p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-mono text-lg font-bold text-blue-700">{grmCase.ticket_number}</p>
                                <Badge>{grmCase.status?.replace('_', ' ')}</Badge>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                <div><span className="text-gray-500">Submitted:</span> <span className="font-medium">{new Date(grmCase.created_at).toLocaleDateString()}</span></div>
                                <div><span className="text-gray-500">Progress:</span> <span className="font-medium">{grmCase.statusHistory.length} updates</span></div>
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-3 font-semibold text-gray-900">Status History</h2>
                            <div className="space-y-3">
                                {grmCase.statusHistory.map((h, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            {i < grmCase.statusHistory.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
                                        </div>
                                        <div className="pb-3">
                                            <p className="font-medium text-sm">{h.status?.replace('_', ' ')}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{new Date(h.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

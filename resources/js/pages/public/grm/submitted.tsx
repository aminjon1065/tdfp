import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function GrmSubmitted({ ticket, trackingToken }: { ticket: string; trackingToken: string }) {
    return (
        <PublicLayout title="Complaint Submitted">
            <div className="container mx-auto px-4 py-20 text-center max-w-lg">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <h1 className="mb-2 text-2xl font-bold text-gray-900">Complaint Submitted</h1>
                <p className="mb-4 text-gray-600">Your complaint has been received. A confirmation email has been sent.</p>
                <div className="mb-8 rounded-lg bg-gray-50 border p-4 space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Your ticket number:</p>
                        <p className="text-2xl font-mono font-bold text-blue-700 mt-1">{ticket}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Your tracking token:</p>
                        <p className="text-xl font-mono font-bold text-slate-800 mt-1 break-all">{trackingToken}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Save both values to track your complaint status securely.</p>
                </div>
                <div className="flex gap-3 justify-center">
                    <Button asChild>
                        <Link href="/grm/track">Track Status</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        </PublicLayout>
    );
}

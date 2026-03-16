import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';

export default function GrmSubmit() {
    const { data, setData, post, processing, errors } = useForm({
        complainant_name: '',
        email: '',
        phone: '',
        category: 'other',
        description: '',
        attachments: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/grm/submit');
    };

    return (
        <PublicLayout title="Submit Complaint">
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Submit a Complaint</h1>
                <p className="mb-8 text-gray-600">Please fill in the form below. All submissions are treated confidentially.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                        <Input id="name" value={data.complainant_name} onChange={(e) => setData('complainant_name', e.target.value)} />
                        {errors.complainant_name && <p className="text-sm text-red-600">{errors.complainant_name}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone (optional)</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                        <select
                            id="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="procurement">Procurement</option>
                            <option value="project_implementation">Project Implementation</option>
                            <option value="environment_social">Environment / Social Impact</option>
                            <option value="corruption">Corruption</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={6}
                            placeholder="Please describe your complaint in detail (minimum 20 characters)..."
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="attachments">Attachments (optional, max 5 files)</Label>
                        <input
                            id="attachments"
                            type="file"
                            multiple
                            onChange={(e) => setData('attachments', Array.from(e.target.files ?? []))}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm"
                        />
                    </div>

                    <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                        <strong>Privacy notice:</strong> Your information will be handled confidentially and used only for processing this complaint.
                    </div>

                    <Button type="submit" disabled={processing} className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                        {processing ? 'Submitting…' : 'Submit Complaint'}
                    </Button>
                </form>
            </div>
        </PublicLayout>
    );
}

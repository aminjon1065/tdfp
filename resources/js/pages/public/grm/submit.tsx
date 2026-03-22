import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import { t } from '@/lib/i18n';

interface Props {
    attachmentConstraints: {
        accept: string;
        allowed_extensions: string[];
        max_files: number;
        max_file_size_mb: number;
    };
}

export default function GrmSubmit({ attachmentConstraints }: Props) {
    const page = usePage().props as any;
    const locale = page.locale ?? 'en';
    const currentUrl = page.ziggy?.location ?? '';
    const { data, setData, post, processing, errors } = useForm({
        complainant_name: '',
        email: '',
        phone: '',
        category: 'other',
        description: '',
        attachments: [] as File[],
    });
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t(locale, 'grm.submit'),
        description: t(locale, 'grm.description'),
        inLanguage: locale,
        url: currentUrl || undefined,
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/grm/submit');
    };

    return (
        <PublicLayout
            title={t(locale, 'grm.submit')}
            description={t(locale, 'grm.description')}
            structuredData={structuredData}
            seoType="website"
        >
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Submit a Complaint</h1>
                <p className="mb-8 text-gray-600">Please fill in the form below. All submissions are treated confidentially.</p>

                <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data" noValidate>
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            name="complainant_name"
                            autoComplete="name"
                            value={data.complainant_name}
                            onChange={(e) => setData('complainant_name', e.target.value)}
                            aria-invalid={!!errors.complainant_name}
                            aria-describedby={errors.complainant_name ? 'complainant-name-error' : undefined}
                        />
                        {errors.complainant_name && <p id="complainant-name-error" role="alert" className="text-sm text-red-600">{errors.complainant_name}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'grm-email-error' : undefined}
                            />
                            {errors.email && <p id="grm-email-error" role="alert" className="text-sm text-red-600">{errors.email}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone (optional)</Label>
                            <Input
                                id="phone"
                                name="phone"
                                autoComplete="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                        <select
                            id="category"
                            name="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            aria-invalid={!!errors.category}
                            aria-describedby={errors.category ? 'grm-category-error' : undefined}
                        >
                            <option value="procurement">Procurement</option>
                            <option value="project_implementation">Project Implementation</option>
                            <option value="environment_social">Environment / Social Impact</option>
                            <option value="corruption">Corruption</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.category && <p id="grm-category-error" role="alert" className="text-sm text-red-600">{errors.category}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={6}
                            placeholder="Please describe your complaint in detail (minimum 20 characters)..."
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            aria-invalid={!!errors.description}
                            aria-describedby={`grm-description-help${errors.description ? ' grm-description-error' : ''}`}
                        />
                        <p id="grm-description-help" className="text-sm text-gray-500">
                            Include enough detail for review. Minimum 20 characters.
                        </p>
                        {errors.description && <p id="grm-description-error" role="alert" className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="attachments">Attachments (optional, max 5 files)</Label>
                        <input
                            id="attachments"
                            name="attachments"
                            type="file"
                            multiple
                            accept={attachmentConstraints.accept}
                            onChange={(e) => setData('attachments', Array.from(e.target.files ?? []))}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm"
                            aria-invalid={!!errors.attachments || !!errors['attachments.0']}
                            aria-describedby={`grm-attachments-help${errors.attachments || errors['attachments.0'] ? ' grm-attachments-error' : ''}`}
                        />
                        <p id="grm-attachments-help" className="text-sm text-gray-500">
                            Allowed formats: {attachmentConstraints.allowed_extensions.join(', ')}. Up to {attachmentConstraints.max_files} files, {attachmentConstraints.max_file_size_mb} MB each.
                        </p>
                        {(errors.attachments || errors['attachments.0']) && (
                            <p id="grm-attachments-error" role="alert" className="text-sm text-red-600">
                                {errors.attachments ?? errors['attachments.0']}
                            </p>
                        )}
                    </div>

                    <div id="grm-privacy-notice" className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                        <strong>Privacy notice:</strong> Your information will be handled confidentially and used only for processing this complaint.
                    </div>

                    <Button type="submit" disabled={processing} className="w-full bg-orange-700 text-white hover:bg-orange-800" size="lg">
                        {processing ? 'Submitting…' : 'Submit Complaint'}
                    </Button>
                </form>
            </div>
        </PublicLayout>
    );
}

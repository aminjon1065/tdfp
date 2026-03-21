import PublicLayout from '@/layouts/public-layout';
import { t } from '@/lib/i18n';
import { usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact({ settings }: { settings: Record<string, string> }) {
    const locale = (usePage().props as any).locale ?? 'en';

    return (
        <PublicLayout title={t(locale, 'contact.title')}>
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{t(locale, 'contact.heading')}</h1>
                <p className="mb-10 text-gray-600">{t(locale, 'contact.description')}</p>
                <address className="not-italic">
                    <dl className="grid gap-8 sm:grid-cols-3">
                        <div className="flex items-start gap-3">
                            <Mail className="mt-0.5 h-5 w-5 text-blue-700" aria-hidden="true" />
                            <div>
                                <dt className="font-semibold">Email</dt>
                                <dd>
                                    <a href={`mailto:${settings.contact_email}`} className="text-sm text-blue-700 hover:underline">
                                        {settings.contact_email ?? 'info@pic.tj'}
                                    </a>
                                </dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="mt-0.5 h-5 w-5 text-blue-700" aria-hidden="true" />
                            <div>
                                <dt className="font-semibold">Phone</dt>
                                <dd className="text-sm text-gray-600">{settings.contact_phone ?? '+992 000 000 000'}</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-5 w-5 text-blue-700" aria-hidden="true" />
                            <div>
                                <dt className="font-semibold">Address</dt>
                                <dd className="text-sm text-gray-600">{settings.contact_address ?? 'Dushanbe, Tajikistan'}</dd>
                            </div>
                        </div>
                    </dl>
                </address>
            </div>
        </PublicLayout>
    );
}

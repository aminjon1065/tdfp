import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact({ settings }: { settings: Record<string, string> }) {
    return (
        <PublicLayout title="Contact">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Contact Us</h1>
                <p className="mb-10 text-gray-600">Get in touch with the Projects Implementation Center</p>

                <div className="grid gap-8 sm:grid-cols-3">
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-blue-700 mt-0.5" />
                        <div>
                            <h3 className="font-semibold">Email</h3>
                            <a href={`mailto:${settings.contact_email}`} className="text-blue-700 hover:underline text-sm">{settings.contact_email ?? 'info@pic.tj'}</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-blue-700 mt-0.5" />
                        <div>
                            <h3 className="font-semibold">Phone</h3>
                            <p className="text-sm text-gray-600">{settings.contact_phone ?? '+992 000 000 000'}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-700 mt-0.5" />
                        <div>
                            <h3 className="font-semibold">Address</h3>
                            <p className="text-sm text-gray-600">{settings.contact_address ?? 'Dushanbe, Tajikistan'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

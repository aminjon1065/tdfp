import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, router, usePage } from '@inertiajs/react';
import { Play } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';

export default function MediaIndex({ items, filters }: { items: any; filters: any }) {
    const locale = (usePage().props as any).locale ?? 'en';
    return (
        <PublicLayout title="Media">
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Media Gallery</h1>
                <p className="mb-8 text-gray-500">Photos and videos from project activities</p>

                <div className="mb-6 flex gap-2">
                    {['', 'image', 'video'].map((type) => (
                        <Button key={type} variant={filters.type === type || (!type && !filters.type) ? 'default' : 'outline'} size="sm"
                            onClick={() => router.get('/media', type ? { type } : {})}>
                            {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'All'}
                        </Button>
                    ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {items.data.map((item: any) => {
                        const t = getTranslation(item, locale);
                        return (
                            <div key={item.id} className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
                                {item.type === 'image' && item.file_path ? (
                                    <img src={`/storage/${item.file_path}`} alt={t.title ?? ''} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-gray-200">
                                        <Play className="h-10 w-10 text-gray-500" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                                {t.title && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                                        <p className="text-white text-sm font-medium">{t.title}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {items.data.length === 0 && (
                    <p className="py-12 text-center text-gray-500">No media items found.</p>
                )}
            </div>
        </PublicLayout>
    );
}

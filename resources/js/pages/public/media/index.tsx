import PublicLayout from '@/layouts/public-layout';
import PublicImage from '@/components/public-image';
import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';
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

                <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {items.data.map((item: any) => {
                        const t = getTranslation(item, locale);
                        return (
                            <li id={`media-item-${item.id}`} key={item.id} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                                <figure className="h-full w-full">
                                {item.type === 'image' && item.file_path ? (
                                    <PublicImage
                                        src={`/storage/${item.file_path}`}
                                        alt={t.title ?? 'Media item'}
                                        className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-105"
                                        sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 100vw"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-gray-200">
                                        <Play className="h-10 w-10 text-gray-500" aria-hidden="true" />
                                        <span className="sr-only">{t.title ?? 'Video media item'}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                                {t.title && (
                                    <figcaption className="absolute right-0 bottom-0 left-0 translate-y-full bg-gradient-to-t from-black/60 p-3 transition-transform group-hover:translate-y-0">
                                        <p className="text-sm font-medium text-white">{t.title}</p>
                                    </figcaption>
                                )}
                                </figure>
                            </li>
                        );
                    })}
                </ul>

                {items.data.length === 0 && (
                    <p className="py-12 text-center text-gray-500">No media items found.</p>
                )}
            </div>
        </PublicLayout>
    );
}

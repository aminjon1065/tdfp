import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2, Image, Video } from 'lucide-react';

interface MediaItem {
    id: number;
    type: 'image' | 'video';
    url: string | null;
    embed_url: string | null;
    translations: { language: string; title: string; description?: string }[];
    created_at: string;
}

interface Props {
    media: {
        data: MediaItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function AdminMediaIndex({ media }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Delete this media item?')) {
            router.delete(`/admin/media/${id}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Media', href: '/admin/media' }]}>
            <Head title="Media" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Media</h1>
                    <Button asChild>
                        <Link href="/admin/media/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Media
                        </Link>
                    </Button>
                </div>

                {media.data.length === 0 && (
                    <p className="text-sm text-muted-foreground">No media items yet.</p>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {media.data.map((item) => {
                        const title =
                            item.translations?.find((t) => t.language === 'en')?.title ?? 'Untitled';
                        return (
                            <Card key={item.id} className="overflow-hidden">
                                <div className="relative aspect-video bg-muted flex items-center justify-center">
                                    {item.type === 'image' && item.url ? (
                                        <img
                                            src={item.url}
                                            alt={title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : item.type === 'video' && item.embed_url ? (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <Video className="h-8 w-8" />
                                            <span className="text-xs">Video</span>
                                        </div>
                                    ) : (
                                        <Image className="h-8 w-8 text-muted-foreground" />
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <Badge variant={item.type === 'image' ? 'default' : 'secondary'}>
                                            {item.type}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-3">
                                    <p className="text-sm font-medium truncate" title={title}>
                                        {title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 w-full"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="mr-1.5 h-3.5 w-3.5 text-destructive" />
                                        Delete
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {media.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page {media.current_page} of {media.last_page} ({media.total} total)
                        </p>
                        <div className="flex gap-1">
                            {media.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import { Copy, Facebook, Linkedin, Share2, Send, Twitter } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

interface SocialShareProps {
    title: string;
    url: string;
    description?: string;
    className?: string;
}

function popup(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer,width=640,height=720');
}

export default function SocialShare({
    title,
    url,
    description,
    className,
}: SocialShareProps) {
    const [copied, setCopied] = useState(false);
    const locale = (usePage().props as any).locale ?? 'en';
    const canUseNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

    async function shareNative(): Promise<void> {
        if (! navigator.share) {
            return;
        }

        try {
            await navigator.share({
                title,
                text: description,
                url,
            });
        } catch {
            //
        }
    }

    async function copyLink(): Promise<void> {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    }

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description ?? '');

    return (
        <section className={className} aria-labelledby="social-share-heading">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 id="social-share-heading" className="text-sm font-semibold text-slate-900">
                            {t(locale, 'share.title')}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            {t(locale, 'share.description')}
                        </p>
                    </div>

                    {canUseNativeShare && (
                        <Button type="button" variant="outline" onClick={() => void shareNative()}>
                            <Share2 className="mr-2 h-4 w-4" />
                            {t(locale, 'share.share')}
                        </Button>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={() => void copyLink()}>
                        <Copy className="mr-2 h-4 w-4" />
                        {copied ? t(locale, 'share.copied') : t(locale, 'share.copy')}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => popup(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
                    >
                        <Facebook className="mr-2 h-4 w-4" />
                        Facebook
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => popup(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`)}
                    >
                        <Twitter className="mr-2 h-4 w-4" />
                        X
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => popup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`)}
                    >
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => popup(`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}%20${encodedDescription}`)}
                    >
                        <Send className="mr-2 h-4 w-4" />
                        Telegram
                    </Button>
                </div>
            </div>
        </section>
    );
}

import { type ImgHTMLAttributes } from 'react';

type NativeLoading = NonNullable<
    ImgHTMLAttributes<HTMLImageElement>['loading']
>;
type NativeDecoding = NonNullable<
    ImgHTMLAttributes<HTMLImageElement>['decoding']
>;

interface PublicImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    priority?: boolean;
}

export default function PublicImage({
    priority = false,
    loading,
    decoding,
    fetchPriority,
    sizes,
    draggable,
    ...props
}: PublicImageProps) {
    const resolvedLoading: NativeLoading =
        loading ?? (priority ? 'eager' : 'lazy');
    const resolvedDecoding: NativeDecoding = decoding ?? 'async';

    return (
        <img
            {...props}
            loading={resolvedLoading}
            decoding={resolvedDecoding}
            fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')}
            sizes={sizes}
            draggable={draggable ?? false}
        />
    );
}

export type FontSize = 'normal' | 'large' | 'xlarge';
export type Contrast = 'default' | 'high' | 'invert';

export interface BVIState {
    enabled: boolean;
    fontSize: FontSize;
    contrast: Contrast;
    lineHeight: 'normal' | 'wide';
    images: 'on' | 'off';
}

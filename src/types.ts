export interface Font {
    family: string;
    weight?: 100 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'normal' | 'bold';
    style?: 'italic' | 'normal' | 'oblique';
    stretch?: 'ultra-condensed'
        | 'extra-condensed'
        | 'condensed'
        | 'semi-condensed'
        | 'normal'
        | 'semi-expanded'
        | 'expanded'
        | 'extra-expanded'
        | 'ultra-expanded';
    styles?: {};
    fallbackStyles?: {};
    class?: string;
    fallbackClass?: string;
    timing?: number;
    [custom: string]: any;
}

export interface Fonts {
    [name: string]: Font;
}

export interface FontsOptions {
    fonts: Fonts;
    timeout?: number;
    onFontReady?: (font: Font) => void;
    onFontTimeout?: (font: Font) => void;
}

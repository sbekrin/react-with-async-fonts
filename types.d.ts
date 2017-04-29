interface Font {
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
    [custom: string]: any;
}

interface Fonts {
    [name: string]: Font;
}

interface Options {
    timeout?: number;
    onLoad?: (font: Font) => void;
    onTimeout?: (font: Font) => void;
}
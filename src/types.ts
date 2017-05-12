export type ReactComponent<T> = React.ComponentClass<T> | React.StatelessComponent<T>;

export interface BasicFont {
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
    [custom: string]: any;
}

export interface InputFont extends BasicFont {
    styles?: {
        initial?: object,
        success: object,
        fallback?: object,
    };
    class?: {
        initial?: string,
        success: string,
        fallback?: string,
    };
}

export interface OutputFont extends BasicFont {
    class?: string;
    styles?: object;
}

export interface InitialFont extends OutputFont { // tslint:disable-line
}

export interface FontWithTiming extends InputFont {
    timing: number;
}

export interface LoadedFont extends OutputFont {
    timing: number;
}

export interface FallbackFont extends OutputFont {
    error: Error;
}

export interface Fonts {
    [name: string]: InputFont;
}

export type Font = InitialFont | LoadedFont | FallbackFont;

export interface Options {
    timeout?: number;
    onFontReady?: (font: LoadedFont) => void;
    onFontTimeout?: (font: FallbackFont) => void;
}

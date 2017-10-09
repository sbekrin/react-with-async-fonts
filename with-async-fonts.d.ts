interface BasicFont {
  family: string;
  weight?: 100 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'normal' | 'bold';
  style?: 'italic' | 'normal' | 'oblique';
  stretch?:
    | 'ultra-condensed'
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

interface InputFont extends BasicFont {
  styles?: {
    initial?: object;
    success: object;
    fallback?: object;
  };
  class?: {
    initial?: string;
    success: string;
    fallback?: string;
  };
}

interface OutputFont extends BasicFont {
  class?: string;
  styles?: object;
}

interface InitialFont extends OutputFont {} // tslint:disable-line

interface FontWithTiming extends InputFont {
  timing: number;
}

interface LoadedFont extends OutputFont {
  timing: number;
}

interface FallbackFont extends OutputFont {
  error: Error;
}

interface Fonts {
  [name: string]: InputFont;
}

type Font = InitialFont | LoadedFont | FallbackFont;

interface Options {
  timeout?: number;
  onFontReady?: (font: LoadedFont) => void;
  onFontTimeout?: (font: FallbackFont) => void;
}

type CancelablePromise<T> = Promise<T> & {
  cancel?: () => void;
};

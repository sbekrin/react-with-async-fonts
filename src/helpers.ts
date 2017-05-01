import * as FontFaceObserver from 'fontfaceobserver';
import { Fonts, Font } from './types';

/**
 * Creates new font observer based on font data
 * @param font - font data to observe
 */
export function load(font: Font, timeout: number): Promise<Font> {
    const { family, style, weight, stretch } = font;
    const observer = new FontFaceObserver(family, { style, weight, stretch });
    return observer.load(null, timeout);
}

/**
 * Map font data for case when font is still waiting to be loaded
 */
export function dataWithLoadingFont({ family, style, stretch, weight }: Font): Font {
    return { family, style, stretch, weight };
}

/**
 * Map font data for case when font is ready before timeout
 */
export function dataWithLoadedFont({ fallbackClass, fallbackStyles, ...font }: Font): Font {
    return { ...font };
}

/**
 * Map font data for case when font timeouted to load
 */
export function dataWithFailedFont({ fallbackClass = '', fallbackStyles = {}, ...font }: Font): Font {
    return {
        ...font,
        class: fallbackClass,
        styles: fallbackStyles,
    };
}

import * as FontFaceObserver from 'fontfaceobserver';
import makeCancelable from './make-cancelable';

/**
 * Creates new font observer based on font data
 * @param font - font data to observe
 */
export function load(
  font: InputFont,
  timeout: number,
): CancelablePromise<InputFont> {
  const { family, style, weight, stretch } = font;
  const observer = new FontFaceObserver(family, { style, weight, stretch });
  return makeCancelable(observer.load(null, timeout));
}

/**
 * Map font data for case when font is still waiting to be loaded
 */
export function dataWithLoadingFont({
  family,
  weight = 'normal',
  style = 'normal',
  stretch = 'normal',
  class: cssClass,
  styles,
}: InputFont): InitialFont {
  return {
    family,
    weight,
    style,
    stretch,
    class: (cssClass && cssClass.initial) || '',
    styles: (styles && styles.initial) || {},
  };
}

/**
 * Map font data for case when font is ready before timeout
 */
export function dataWithLoadedFont(
  font: InputFont | FontWithTiming,
): LoadedFont {
  return {
    ...font,
    timing: font.timing || -1,
    class: (font.class && font.class.success) || '',
    styles: (font.styles && font.styles.success) || {},
  };
}

/**
 * Map font data for case when font timeouted to load
 */
export function dataWithFailedFont(font: InputFont): FallbackFont {
  const cssClass =
    (font.class && (font.class.fallback || font.class.initial)) || '';
  const styles =
    (font.styles && (font.styles.fallback || font.styles.initial)) || {};

  return {
    ...font,
    class: cssClass,
    styles,
    error: font.error || new Error(),
  };
}

export const noop = () => {}; // tslint:disable-line

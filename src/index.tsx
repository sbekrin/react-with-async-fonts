/// <reference path="../types.d.ts" />
import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {
  dataWithFailedFont,
  dataWithLoadedFont,
  dataWithLoadingFont,
  load,
  noop,
} from './helpers';

export interface State {
  [name: string]: Font;
}

/**
 * Wraps component with HoC and injects user-provided fonts props
 */
function withAsyncFonts<P>(
  fonts: Fonts,
  userOptions?: Options,
): (
  BaseComponent: React.ComponentType<P & State>,
) => React.ComponentType<P & State> {
  const options: Options = {
    onFontTimeout: noop,
    onFontReady: noop,
    timeout: 5000,
    ...userOptions,
  };

  return BaseComponent => {
    const originalName =
      BaseComponent.displayName || BaseComponent.name || 'Component';

    class WithAsyncFonts extends React.Component<P & State, State> {
      public static displayName = `withAsyncFonts(${originalName})`;

      private promises: Array<CancelablePromise<InputFont>> = [];

      constructor(props) {
        super(props);

        // Set default state with basic font values
        this.state = Object.keys(fonts).reduce((state, code) => {
          const font = fonts[code];
          return { ...state, [code]: dataWithLoadingFont(font) };
        }, {});
      }

      public componentDidMount() {
        const { onFontReady, onFontTimeout, timeout } = options;
        const keys = Object.keys(fonts);

        // Collect cancelable promises
        this.promises = keys.reduce(
          (promises, code) => [...promises, load(fonts[code], timeout)],
          [],
        );

        // Resolve fonts
        this.promises.forEach((promise, index) => {
          const timing = Date.now();
          const key = keys[index];
          const inputFont = fonts[key];
          promise
            .then(resolvedFont => {
              const loadedFont = dataWithLoadedFont({
                ...inputFont,
                ...resolvedFont,
                timing: Date.now() - timing,
              });
              this.setState(
                () => ({ [key]: loadedFont }),
                () => onFontReady(loadedFont),
              );
            })
            .catch(({ isCanceled }) => {
              if (isCanceled) {
                return; // Do nothing
              }
              const fallbackFont = dataWithFailedFont(inputFont);
              this.setState(
                () => ({ [key]: fallbackFont }),
                () => onFontTimeout(fallbackFont),
              );
            });
        });
      }

      public componentWillUnmount() {
        // Mark all promises as canceled once component is unmounted
        this.promises.forEach(promise => promise.cancel());
      }

      public render() {
        return <BaseComponent {...this.props} {...this.state} />;
      }
    }

    return hoistNonReactStatic<P & State, P>(WithAsyncFonts, BaseComponent);
  };
}

export default withAsyncFonts;

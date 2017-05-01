import 'core-js/fn/object/entries';
import * as React from 'react';
import { FontsOptions, Fonts } from './types';
import {
    dataWithFailedFont,
    dataWithLoadedFont,
    dataWithLoadingFont,
    load,
} from './helpers';

type ReactComponent<T> = React.ComponentClass<T> | React.StatelessComponent<T>;

/**
 * Wraps component with HoC and injects user-provided fonts props
 */
function withAsyncFonts<P>(userOptions: FontsOptions) {
    const options: FontsOptions = {
        timeout: 5000,
        ...userOptions,
    };

    return (BaseComponent: ReactComponent<P>): React.ComponentClass<P> => {

        // Keep original component name to use for display name
        const originalName = BaseComponent.displayName || 'Component';

        return class WithAsyncFontsHoC extends React.Component<P, Fonts> {
            public displayName = `WithAsyncFonts(${originalName})`;

            public render(): JSX.Element {
                return React.createElement(
                    (BaseComponent as React.ComponentClass<{}>),
                    { ...(this.props as object), ...this.state },
                );
            }

            protected componentWillMount(): void {

                // Set default state with base font values
                Object.entries(options.fonts).forEach(([ code, font ]) => {
                    this.setState({
                        [code]: dataWithLoadingFont(font),
                    });
                });
            }

            protected componentDidMount(): void {
                const {
                    onFontReady,
                    onFontTimeout,
                    timeout,
                } = options;

                // Iterate though all fonts and run individual observers
                Object.entries(options.fonts).forEach(([ code, font ]) => {
                    const timing = Date.now();

                    load(font, timeout)
                        .then((resolvedFonts) => ({
                            ...resolvedFonts,
                            ...font,
                            timing: Date.now() - timing,
                        }))
                        .then((resolvedFont) => {
                            this.setState({
                                [code]: dataWithLoadedFont(resolvedFont),
                            });

                            if (onFontReady) {
                                onFontReady(resolvedFont);
                            }
                        })
                        .catch(() => {
                            this.setState({
                                [code]: dataWithFailedFont(font),
                            });

                            if (onFontTimeout) {
                                onFontTimeout(font);
                            }
                        });
                });
            }
        };
    };
}

export default withAsyncFonts;

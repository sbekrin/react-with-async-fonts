import 'core-js/fn/object/entries';
import * as React from 'react';
import { ReactComponent, Options, Fonts, Font, FontWithTiming } from './types';
import {
    dataWithFailedFont,
    dataWithLoadedFont,
    dataWithLoadingFont,
    load,
} from './helpers';

export interface State {
    [name: string]: Font;
}

/**
 * Wraps component with HoC and injects user-provided fonts props
 */
function withAsyncFonts<P>(fonts: Fonts, userOptions?: Options) {
    const options: Options = {
        timeout: 5000,
        ...userOptions,
    };

    return (BaseComponent: ReactComponent<P>): React.ComponentClass<P> => {

        // Keep original component name to use for display name
        const originalName = BaseComponent.displayName || 'Component';

        return class WithAsyncFontsHoC extends React.Component<P, State> {
            public displayName = `WithAsyncFonts(${originalName})`;

            public render(): JSX.Element {
                return React.createElement(
                    (BaseComponent as React.ComponentClass<{}>),
                    { ...(this.props as object), ...this.state },
                );
            }

            protected componentWillMount(): void {

                // Set default state with base font values
                Object.entries(fonts).forEach(([ code, font ]) => {
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
                Object.entries(fonts).forEach(([ code, inputFont ]) => {
                    const timing = Date.now();

                    load(inputFont, timeout)
                        .then((resolvedFont) => {
                            const loadedFont = dataWithLoadedFont({
                                ...resolvedFont,
                                ...inputFont,
                                timing: Date.now() - timing,
                            });

                            this.setState({ [code]: loadedFont });

                            if (onFontReady) {
                                onFontReady(loadedFont);
                            }
                        })
                        .catch(() => {
                            const fallbackFont = dataWithFailedFont(inputFont);

                            this.setState({ [code]: fallbackFont });

                            if (onFontTimeout) {
                                onFontTimeout(fallbackFont);
                            }
                        });
                });
            }
        };
    };
}

export default withAsyncFonts;

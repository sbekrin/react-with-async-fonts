import 'core-js/fn/object/entries';
import * as React from 'react';
import {
    dataWithFailedFont,
    dataWithLoadedFont,
    dataWithLoadingFont,
    load,
} from './helpers';

/**
 * Wraps component with HoC and injects user-provided fonts props
 * @param BaseComponent - target component to hook
 * @param fonts - fonts object where key will become prop with font data
 * @param options - optional props to setup fonts
 */
function withAsyncFonts<P>(
    BaseComponent: React.ComponentClass<P> | React.StatelessComponent<P>,
    fonts: Fonts,
    options?: Options,
): React.ComponentClass<P> {

    // Keep original component name to use for display name
    const originalName = BaseComponent.displayName || 'Component';

    // Setup defaults with user-provided options
    const optionsWithDefaults: Options = {
        onLoad: (font) => null,
        onTimeout: (font) => null,
        timeout: 5000,
        ...options,
    };

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
            Object.entries(fonts).forEach(([ code, font ]) => {
                this.setState({ [code]: dataWithLoadingFont(font) });
            });
        }

        protected componentDidMount(): void {
            const { onLoad, onTimeout, timeout } = optionsWithDefaults;

            // Iterate though all fonts and run individual observers
            Object.entries(fonts).forEach(([ code, font ]) => {
                load(font, timeout)
                    .then(() => {
                        this.setState({ [code]: dataWithLoadedFont(font) });
                        onLoad(font);
                    })
                    .catch(() => {
                        this.setState({ [code]: dataWithFailedFont(font) });
                        onTimeout(font);
                    });
            });
        }
    };
}

export default withAsyncFonts;

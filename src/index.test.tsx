import * as React from 'react';
import { shallow, mount } from 'enzyme';
import * as FontFaceObserver from 'fontfaceobserver';
import withAsyncFonts from './index';
import { Font } from './types';

const wait = (delay: number) => new Promise(
    (resolve) => setTimeout(resolve, delay),
);

describe('withAsyncFonts()', () => {
    describe('when it used with different component defenitions', () => {
        it('should work with functional components', () => {
            const FooComponent = (props) => (
                <div className={props.fooFont300.class}>Foo</div>
            );

            const HocComponent = withAsyncFonts({
                fonts: {
                    fooFont300: {
                        family: 'Foo',
                    },
                },
            })(FooComponent);

            expect(shallow(<HocComponent />).exists()).toBeTruthy();
        });

        it('should work with class components', () => {
            class FooComponent extends React.Component<{ fooFont300?: Font }, void> {
                public render() {
                    return <div className={this.props.fooFont300.class}>Foo</div>;
                }
            }

            const HocComponent = withAsyncFonts({
                fonts: {
                    fooFont300: {
                        family: 'Foo',
                    },
                },
            })(FooComponent);

            expect(shallow(<HocComponent />).exists()).toBeTruthy();
        });
    });

    describe('when it succeeds to load a font', () => {
        function createHoC(testOptions = {}) {
            const options = {
                fonts: {
                    tnrFont: {
                        family: 'Times New Roman',
                        class: 'font-loaded',
                        styles: {
                            fontFamily: 'Times New Roman, serif',
                        },
                    },
                },
                ...testOptions,
            };
            const Component = (props) => (
                <div
                    style={props.tnrFont.styles}
                    className={props.tnrFont.class}
                >Foo</div>
            );
            const HocComponent = withAsyncFonts(options)(Component);

            return mount(<HocComponent />);
        }

        it('should set full font prop data', async () => {
            const target = createHoC();

            expect(target.containsMatchingElement(<div>Foo</div>)).toBeTruthy();
            await wait(500);
            expect(target.containsMatchingElement(
                <div
                    className="font-loaded"
                    style={{ fontFamily: 'Times New Roman, serif' }}
                >Foo</div>,
            )).toBeTruthy();
        });

        it('should call onLoad callback with font data', async () => {
            const loadedCallback = jest.fn();
            const target = createHoC({
                onFontReady: loadedCallback,
            });

            await wait(500);
            expect(loadedCallback).toHaveBeenCalledWith({
                family: 'Times New Roman',
                weight: 'normal',
                stretch: 'normal',
                style: 'normal',
                class: 'font-loaded',
                styles: {
                    fontFamily: 'Times New Roman, serif',
                },
                timing: expect.any(Number),
            });
        });
    });

    describe('when it timeouts or fails to load a font', () => {
        function createHoC(options = {}) {
            const testOptions = {
                fonts: {
                    barFont: {
                        family: 'NON-EXISTING-FONT',
                        fallbackClass: 'font-failed',
                        fallbackStyles: {
                            fontFamily: 'Arial, sans-serif',
                        },
                    },
                },
                ...options,
            };
            const FooComponent = withAsyncFonts(testOptions)(
                (props: { barFont?: Font }) => (
                    <div
                        className={props.barFont.class}
                        style={props.barFont.styles}
                    >Foo</div>
                ),
            );

            return mount(<FooComponent />);
        }

        beforeEach(() => {
            // FontFaceObserver will always resolve fonts on mocked test
            // enviroment, so we need to force it to reject font from being
            // loaded
            jest.spyOn(FontFaceObserver.prototype, 'load').mockReturnValue(
                new Promise((_, reject) => reject()),
            );
        });

        afterEach(() => {
            jest.spyOn(FontFaceObserver.prototype, 'load').mockReset();
        });

        it('should set font prop with fallback data', async () => {
            const target = createHoC({
                timeout: 100,
            });

            expect(target.containsMatchingElement(<div>Foo</div>)).toBeTruthy();
            await wait(1000);
            expect(target.containsMatchingElement(
                <div
                    className="font-failed"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                >Foo</div>,
            )).toBeTruthy();
        });

        it('should call onTimeout callback with font data', async () => {
            const timeoutCallbackSpy = jest.fn();
            const target = createHoC({
                timeout: 100,
                onFontTimeout: timeoutCallbackSpy,
            });

            await wait(500);
            expect(timeoutCallbackSpy).toHaveBeenCalledWith({
                family: 'NON-EXISTING-FONT',
                fallbackClass: 'font-failed',
                fallbackStyles: {
                    fontFamily: 'Arial, sans-serif',
                },
            });
        });
    });
});

import * as React from 'react';
import { shallow, mount } from 'enzyme';
import * as FontFaceObserver from 'fontfaceobserver';
import withAsyncFonts from './index';

const wait = (delay: number) => new Promise(
    (resolve) => setTimeout(resolve, delay),
);

describe('withAsyncFonts()', () => {
    describe('when it used with different component defenitions', () => {
        it('should work with functional components', () => {
            const FooComponent = (props) => (
                <div className={props.fooFont300.class}>Foo</div>
            );

            const HocComponent = withAsyncFonts(FooComponent, {
                fooFont300: {
                    family: 'Foo',
                },
            });

            expect(shallow(<HocComponent />).exists()).toBeTruthy();
        });

        it('should work with class components', () => {
            class FooComponent extends React.Component<{ fooFont300?: Font }, void> {
                public render() {
                    return <div className={this.props.fooFont300.class}>Foo</div>;
                }
            }

            const HocComponent = withAsyncFonts(FooComponent, {
                fooFont300: {
                    family: 'Foo',
                },
            });

            expect(shallow(<HocComponent />).exists()).toBeTruthy();
        });
    });

    describe('when it succeeds to load a font', () => {
        function createHoC(options = {}) {
            const FooComponent = withAsyncFonts((props: { tnrFont300?: Font }) => (
                <div
                    style={props.tnrFont300.styles}
                    className={props.tnrFont300.class}
                >Foo</div>
            ), {
                tnrFont300: {
                    family: 'Times New Roman',
                    class: 'font-loaded',
                    styles: {
                        fontFamily: 'Times New Roman, serif',
                    },
                },
            }, options);

            return mount(<FooComponent />);
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

        it('should call onLoad callback', async () => {
            const loadedCallback = jest.fn();
            const target = createHoC({
                onLoad: loadedCallback,
            });

            await wait(500);

            expect(loadedCallback).toHaveBeenCalled();
        });
    });

    describe('when it timeouts or fails to load a font', () => {
        function createHoC(options = {}) {
            const FooComponent = withAsyncFonts((props: { barFont?: Font }) => (
                <div
                    className={props.barFont.class}
                    style={props.barFont.styles}
                >Foo</div>
            ), {
                barFont: {
                    family: 'NON-EXISTING-FONT',
                    fallbackClass: 'font-failed',
                    fallbackStyles: {
                        fontFamily: 'Arial, sans-serif',
                    },
                },
            }, options);

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

        it('should call onTimeout callback', async () => {
            const timeoutCallbackSpy = jest.fn();
            const target = createHoC({
                timeout: 100,
                onTimeout: timeoutCallbackSpy,
            });

            await wait(500);
            expect(timeoutCallbackSpy).toHaveBeenCalled();
        });
    });
});

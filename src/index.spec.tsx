import * as React from 'react';
import * as FontFaceObserver from 'fontfaceobserver';
import { shallow, mount } from 'enzyme';
import withAsyncFonts from './index';

const wait = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay));

describe('withAsyncFonts()', () => {
  describe('when it used with different component definitions', () => {
    it('should work with functional components', () => {
      const FooComponent = withAsyncFonts({
        fooFont300: { family: 'Foo' },
      })(({ fooFont300 }) => <div className={fooFont300.class}>Foo</div>);

      expect(shallow(<FooComponent />).exists()).toBeTruthy();
    });

    it('should work with class components', () => {
      const FooComponent = withAsyncFonts({
        fooFont300: {
          family: 'Foo',
        },
      })(
        class extends React.Component<any> {
          public render() {
            return <div className={this.props.fooFont300.class}>Foo</div>;
          }
        },
      );

      expect(shallow(<FooComponent />).exists()).toBeTruthy();
    });
    it('should work with static method inside class components', () => {
      const FooComponent = withAsyncFonts({
        fooFont300: {
          family: 'Foo',
        },
      })(
        class extends React.Component<any> {
          public static Foo: Function;

          public render() {
            return <div className={this.props.fooFont300.class}>Foo</div>;
          }
        },
      );

      expect(shallow(<FooComponent.Foo />).exists()).toBeTruthy();
    });
  });

  describe('when it succeeds to load a font', () => {
    function createHoC(options = {}) {
      const fonts: Fonts = {
        tnrFont: {
          family: 'Times New Roman',
          class: {
            success: 'font-loaded',
          },
          styles: {
            success: {
              fontFamily: 'Times New Roman, serif',
            },
          },
        },
      };
      const TestComponent = withAsyncFonts(fonts, options)(({ tnrFont }) => (
        <div className={tnrFont.class} style={tnrFont.styles}>
          Foo
        </div>
      ));

      return mount(<TestComponent />);
    }

    it('should set full font prop data', async () => {
      const target = createHoC();
      expect(target.containsMatchingElement(<div>Foo</div>)).toBeTruthy();
      await wait(500);
      expect(
        target.containsMatchingElement([
          <div
            className="font-loaded"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Foo
          </div>,
        ]),
      ).toEqual(true);
    });

    it('should call onFontReady callback with font data', async () => {
      const loadedCallbackSpy = jest.fn();
      const target = createHoC({ onFontReady: loadedCallbackSpy });
      await wait(500);
      expect(loadedCallbackSpy).toHaveBeenCalledWith({
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
      const fonts: Fonts = {
        barFont: {
          family: 'NON-EXISTING-FONT',
          class: {
            success: 'font-loaded',
            fallback: 'font-failed',
          },
          styles: {
            success: {
              fontFamily: 'Times New Roman, serif',
            },
            fallback: {
              fontFamily: 'Arial, sans-serif',
            },
          },
        },
      };
      const FooComponent = withAsyncFonts(fonts, options)(({ barFont }) => (
        <div className={barFont.class} style={barFont.styles}>
          Foo
        </div>
      ));

      return mount(<FooComponent />);
    }

    beforeEach(() => {
      // FontFaceObserver will always resolve fonts on mocked test
      // enviroment, so we need to force it to reject font from being
      // loaded
      jest
        .spyOn(FontFaceObserver.prototype, 'load')
        .mockReturnValue(Promise.reject(false));
    });

    afterEach(() => {
      jest.spyOn(FontFaceObserver.prototype, 'load').mockReset();
    });

    it('should set font prop with fallback data', async () => {
      const target = createHoC({ timeout: 100 });
      expect(target.containsMatchingElement(<div>Foo</div>)).toBeTruthy();
      await wait(1000);
      expect(
        target.containsMatchingElement([
          <div
            className="font-failed"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Foo
          </div>,
        ]),
      ).toBeTruthy();
    });

    it('should call onFontTimeout callback with font data', async () => {
      const timeoutCallbackSpy = jest.fn();
      const target = createHoC({
        timeout: 100,
        onFontTimeout: timeoutCallbackSpy,
      });
      await wait(500);
      expect(timeoutCallbackSpy).toHaveBeenCalledWith({
        family: 'NON-EXISTING-FONT',
        class: 'font-failed',
        styles: {
          fontFamily: 'Arial, sans-serif',
        },
        error: expect.any(Error),
      });
    });
  });

  describe('when component unmounted before font is loaded', () => {
    const TestComponent = withAsyncFonts({
      arialFont: { family: 'Arial' },
    })(({ arialFont }) => <div className={arialFont.class}>Arial</div>);

    const target = mount(<TestComponent />);
    target.unmount();
  });
});

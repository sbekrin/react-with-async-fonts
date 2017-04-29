# withAsyncFonts
Small and flexible module to work with fonts with css modules & css-in-js.
This library provies simple HoC with injecting additional font props,
which will be passed once font is loaded or use fallback values otherwise.

### Basic usage
```javascript
import withAsyncFonts from 'react-with-async-fonts';

const openSansFont = {
    family: 'Open Sans', // Only required field, should be same as in CSS. Fonts can be loaded in any way.
    weight: 300,
    class: 'font-ready',
    fallbackClass: 'font-failed'
}; 

/**
    `openSans300.class` will be:
    1. undefined while font is loading
    2. 'font-ready' when font is ready
    3. 'font-failed' when font timeouted
*/
const fooComponent = ({ openSans300 }) => (
    <div className={openSans300.class}>Hello world</div>
);

export default withAsyncFonts(fooComponent, {
    openSans300: openSansFont
});
```
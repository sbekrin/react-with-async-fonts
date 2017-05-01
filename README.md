# withAsyncFonts
[![npm Version](https://img.shields.io/npm/v/react-with-async-fonts.svg?maxAge=0)](https://www.npmjs.com/package/react-with-async-fonts) [![Build Status](https://img.shields.io/travis/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://travis-ci.org/sergeybekrin/react-with-async-fonts) [![Coverage Status](https://img.shields.io/coveralls/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://coveralls.io/github/sergeybekrin/react-with-async-fonts?branch=master) [![dependencies Status](https://img.shields.io/david/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://david-dm.org/sergeybekrin/react-with-async-fonts) [![devDependencies Status](https://img.shields.io/david/dev/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://david-dm.org/sergeybekrin/react-with-async-fonts?type=dev)

Small and flexible module to work with fonts with css modules & css-in-js.
This library provies simple HoC with injecting additional font props,
which will be passed once font is loaded or use fallback values otherwise.

## Basic usage
```jsx
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
const FooComponent = ({ openSans300 }) => (
    <div className={openSans300.class}>Hello world</div>
);

export default withAsyncFonts(FooComponent, {
    openSans300: openSansFont,
    class: 'opensans-font',
    fallbackClass: 'system-font'
});
```

## License
MIT
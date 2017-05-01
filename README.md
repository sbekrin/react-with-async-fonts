# withAsyncFonts
Small and flexible module to work with fonts with css modules & css-in-js.
This library provies simple HoC with injecting additional font props,
which will be passed once font is loaded or use fallback values otherwise.

[![Build Status](https://travis-ci.org/sergeybekrin/react-with-async-fonts.svg?branch=master)](https://travis-ci.org/sergeybekrin/react-with-async-fonts)
[![Coverage Status](https://coveralls.io/repos/github/sergeybekrin/react-with-async-fonts/badge.svg?branch=master)](https://coveralls.io/github/sergeybekrin/react-with-async-fonts?branch=master)

## Basic usage
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
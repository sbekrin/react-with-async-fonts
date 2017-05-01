# withAsyncFonts
[![npm Version](https://img.shields.io/npm/v/react-with-async-fonts.svg?maxAge=0)](https://www.npmjs.com/package/react-with-async-fonts) [![Build Status](https://img.shields.io/travis/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://travis-ci.org/sergeybekrin/react-with-async-fonts) [![Coverage Status](https://img.shields.io/coveralls/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://coveralls.io/github/sergeybekrin/react-with-async-fonts?branch=master) [![dependencies Status](https://img.shields.io/david/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://david-dm.org/sergeybekrin/react-with-async-fonts) [![devDependencies Status](https://img.shields.io/david/dev/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://david-dm.org/sergeybekrin/react-with-async-fonts?type=dev)

Small and flexible module to work with fonts with css modules & css-in-js.
This library provies simple HoC with injecting additional font props,
which will be passed once font is loaded or use fallback values otherwise.

## Usage
### With basic `className`
```jsx
import withAsyncFonts from 'react-with-async-fonts';

// Required fonts object
const fonts = {

    // Font key will be prop with same name when passed to component
    openSans300: {

        // Only required field, should be same as in CSS
        // Fonts can be loaded in any way (e.g. via link or @import)
        family: 'Open Sans',

        // Additional font props
        weight: 'normal',
        style: 'normal',
        stretch: 'normal',

        // Props for successfully loaded font
        class: 'opensans-font',
        styles: {
            fontFamily: 'Open Sans, sans-serif',
        },

        // Props for timeouted or failed font, will be passed without
        // `fallback` prefix
        fallbackClass: 'system-font',
        fallbackStyles: {
            fontFamily: '"Comic Sans", cursive',
        },

        // You can also provide custom data which will be passed only
        // for successfully loaded font
        fooBar: 42,
    },
};

// Optional options objects
const options = {

    // Callback for timeouted font
    onTimeout(font) {},

    // Callback for loaded font
    onLoad(font) {},

    // Timeout, in ms
    timeout: 5000,
};

/**
    `openSans300.class` will be:
    1. undefined while font is loading
    2. 'opensans-font' when font is ready
    3. 'system-font' when font timeouted
*/
const FooComponent = ({ openSans300 }) => (
    <div className={openSans300.class}>Hello world</div>
);

export default withAsyncFonts(FooComponent, fonts);
```

### With [React JSS](https://github.com/cssinjs/react-jss)
```jsx
import React from 'react';
import withAsyncFonts from 'react-with-async-fonts';
import injectSheet from 'react-jss';

// Fonts object with target fonts
const fonts = {
    openSansFont: {
        family: 'Open Sans',
        styles: {
            fontFamily: 'Open Sans, sans-serif',
        },
        fallbackStyles: {
            fontFamily: 'Helvetica, Arial, sans-serif',
        },
    },
};

// Styles with dynamic `fontFamily` prop
const styles = {
    heading: {
        color: 'purple',
        fontSize: 25,
        fontFamily: props => props.openSansFont.styles.fontFamily,
    },
};

const Heading = ({ classes, children }) => (
    <h1 className={classes.heading}>
        {children}
    </h1>
);

export default injectSheet(styles)(withAsyncFonts(Button, fonts));
```

## License
MIT
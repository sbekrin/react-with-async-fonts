# withAsyncFonts
[![npm Version](https://img.shields.io/npm/v/react-with-async-fonts.svg?maxAge=0)](https://www.npmjs.com/package/react-with-async-fonts) [![Build Status](https://img.shields.io/travis/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://travis-ci.org/sergeybekrin/react-with-async-fonts) [![Coverage Status](https://img.shields.io/coveralls/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://coveralls.io/github/sergeybekrin/react-with-async-fonts?branch=master) [![dependencies Status](https://img.shields.io/david/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://david-dm.org/sergeybekrin/react-with-async-fonts) [![devDependencies Status](https://img.shields.io/david/dev/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://david-dm.org/sergeybekrin/react-with-async-fonts?type=dev)

This is small and flexible module for managing custom loaded fonts. It's designed
to work with css modules & css-in-js tools out of the box.

```jsx
import withAsyncFonts from 'react-with-async-fonts';

const openSansFont = {
    family: 'Open Sans',
    class: {
        initial: 'system-font',
        success: 'opensans-font',
    },
};

export default withAsyncFonts({ openSansFont })(({ openSansFont }) => (
    <h1 className={openSansFont.class}>Hello!</h1>
));
```

## Full Usage
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

        // Additional font props you can use
        weight: 300,
        style: 'normal',
        stretch: 'normal',

        // Class prop for using via `className`
        class: {
            initial: 'system-font',
            success: 'opensans-font',
            // `initial` will be used instead if not set
            fallback: 'system-font',
        },
        styles: {
            initial: {
                fontFamily: 'Arial, Helvetica, sans-serif',
            },
            success: {
                fontFamily: 'Open Sans, sans-serif',
            },
            fallback: {
                // `initial` will be used instead if not set
                fontFamily: '"Comic Sans", cursive',
            },
        },

        // `timing` prop will be set for successfully loaded fonts only
        timing: 100,

        // You can also provide custom data which will be passed only
        // for successfully loaded font
        fooBar: 42,
    },
};

const options = {

    // Optional callbacks for handling fonts status
    onFontReady(font) {},
    onFontTimeout(font) {},

    // Optional timeout (5s by default), in ms
    timeout: 5000,
};

const FooComponent = ({ openSans300 }) => (
    <div className={openSans300.class}>Hello world</div>
);

export default withAsyncFonts(fonts, options)(FooComponent);
```

### With [React JSS](https://github.com/cssinjs/react-jss)
```jsx
import React from 'react';
import withAsyncFonts from 'react-with-async-fonts';
import injectSheet from 'react-jss';

const fonts = {
    openSansFont: {
        family: 'Open Sans',
        styles: {
            initial: {
                fontFamily: 'Helvetica, Arial, sans-serif',
            },
            success: {
                fontFamily: 'Open Sans, sans-serif',
            },
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

// You can compose those HoCs for sure
const HeadingWithFonts = withAsyncFonts(fonts)(Heading);
const HeadingWithStyles = injectSheet(styles)(HeadingWithFonts);

export default HeadingWithStyles;
```

## License
MIT
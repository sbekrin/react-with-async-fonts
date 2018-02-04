# react-with-async-fonts

[![npm Version](https://img.shields.io/npm/v/react-with-async-fonts.svg?maxAge=0)](https://www.npmjs.com/package/react-with-async-fonts)
[![Build Status](https://img.shields.io/travis/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://travis-ci.org/sergeybekrin/react-with-async-fonts)
[![Coverage Status](https://img.shields.io/coveralls/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://coveralls.io/github/sergeybekrin/react-with-async-fonts?branch=master)
[![dependencies Status](https://img.shields.io/david/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://david-dm.org/sergeybekrin/react-with-async-fonts)
[![devDependencies Status](https://img.shields.io/david/dev/sergeybekrin/react-with-async-fonts.svg?maxAge=0)](https://david-dm.org/sergeybekrin/react-with-async-fonts?type=dev)

> Note: version 4.x introduces breaking changes with new API. It addresses bunch
> of issues, including canceling promises, better performance, and TS typings.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Quick Start](#quick-start)
* [API](#api)
  * [`FontObserver` component](#fontobserver-component)
  * [`FontSubscriber` component](#fontsubscriber-component)
  * [`withFonts` HoC](#withfonts-hoc)
  * [`Font` type](#font-type)
* [Examples](#examples)
  * [Basic with `FontSubscriber`](#basic-with-fontsubscriber)
  * [Basic with `withFonts`](#basic-with-withfonts)
  * [With `styled-components`](#with-styled-components)
* [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Quick Start

1. Install `react-with-async-fonts`:

npm:

```bash
npm install --save react-with-async-fonts
```

yarn:

```bash
yarn add react-with-async-fonts
```

2. Wrap your root component with `FontObserver`:

Set prop with font name. You can access it later in `FontSubscriber` to check if
it's ready.

```js
import { FontObserver } from 'react-with-async-fonts';
import { render } from 'react-dom';
import App from './app';

render(
  <FontObserver openSans="Open Sans">
    <App />
  </FontObserver>,
  document.getElementById('root'),
);
```

3. Wrap your target with `FontSubscriber` component:

> Tip: you can also use [`withFonts` API](#withFonts) if you're really into
> HoCs.

Note that `FontSubscriber` uses children render prop. Provided function would be
called with single argument which is an object with loaded font keys.

```js
import { FontSubscriber } from 'react-with-async-fonts';

const Heading = ({ children }) => (
  <FontSubscriber>
    {fonts => (
      <h1 className={fonts.openSans ? 'opens-sans-font' : 'system-font'}>
        {children}
      </h1>
    )}
  </FontSubscriber>
);

export default Heading;
```

## API

### `FontObserver` component

```js
import { FontObserver } from 'react-with-async-fonts';
```

| Prop    | Type            | Description                                          |
| ------- | --------------- | ---------------------------------------------------- |
| `[key]` | `Font | string` | Font family string or a [`Font` object](#font-type). |

### `FontSubscriber` component

```js
import { FontSubscriber } from 'react-with-async-fonts';
```

| Prop       | Type                                    | Description                                                                                                                  |
| ---------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `children` | `(fonts: Object) => React.Element<any>` | Children render function. Accepts object with loaded font. Once ready, it would contain object of [`Font` type](#font-type). |

### `withFonts` HoC

```js
import { withFonts } from 'react-with-async-fonts';
```

| Argument  | Type                       | Description                                         |
| --------- | -------------------------- | --------------------------------------------------- |
| component | `React.ComponentType<any>` | Component to wrap with HoC. Injects `fonts` object. |

### `Font` type

```js
type Font = {
  family: String,
  weight?:
    | 'normal'
    | 'bold'
    | 'bolder'
    | 'lighter'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900',
  style?: 'normal' | 'italic' | 'oblique',
  stretch?:
    | 'normal'
    | 'ultra-condensed'
    | 'extra-condensed'
    | 'condensed'
    | 'semi-condensed'
    | 'semi-expanded'
    | 'expanded'
    | 'extra-expanded'
    | 'ultra-expanded',
};
```

## Examples

Heads up! Each example requires wrapping your app with
[`FontObserver`](#fontobserver-component):

```js
import React from 'react';
import { render } from 'react-dom';
import { FontObserver } from 'react-with-async-fonts';
import App from './app';

render(
  <FontObserver montserrat="Montserrat">
    <App />
  </FontObserver>,
  document.getElementById('root'),
);
```

### Basic with `FontSubscriber`

```js
import React from 'react';
import { FontSubscriber } from 'react-with-async-fonts';

const Heading = ({ children }) => (
  <FontSubscriber>
    {fonts => (
      <h1 className={fonts.montserrat && 'montserrat-font'}>{children}</h1>
    )}
  </FontSubscriber>
);

export default Heading;
```

### Basic with `withFonts`

```js
import React from 'react';
import { withFonts } from 'react-with-async-fonts';

const Heading = ({ children, fonts }) => (
  <h1 className={fonts.montserrat && 'montserrat-font'}>{children}</h1>
);

export default withFonts(Heading);
```

### With `styled-components`

```js
import styled from 'styled-components';
import { withFonts } from 'react-with-async-fonts';

const Heading = styled.h2`
  font-weight: 300;
  font-family: ${props =>
    props.fonts.montserrat
      ? '"Open Sans", sans-serif'
      : 'Helvetica, sans-serif'};
`;

export default withFonts(Heading);
```

## License

MIT &copy; [Sergey Bekrin](http://bekrin.me)

import * as React from 'react';
import * as T from 'prop-types';
import * as FontFaceObserver from 'fontfaceobserver';
import * as Cancelable from 'p-cancelable';
import * as invariant from 'invariant';

export interface Font {
  family: string;
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
    | '900';
  style?: 'normal' | 'italic' | 'oblique';
  stretch?:
    | 'normal'
    | 'ultra-condensed'
    | 'extra-condensed'
    | 'condensed'
    | 'semi-condensed'
    | 'semi-expanded'
    | 'expanded'
    | 'extra-expanded'
    | 'ultra-expanded';
}

/** Checks if value is an actual object */
const isObject = (value: any): value is object => {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
};

/** Checks if value is a string */
const isString = (value: any): value is string => {
  return typeof value === 'string';
};

/** Returns actual type of value */
const getType = value => {
  if (value === null) {
    return 'null';
  } else if (Array.isArray(value)) {
    return 'array';
  }
  return typeof value;
};

export interface ObserverState {
  [key: string]: Font;
}

export type ObserverProps = {
  children: Array<React.ReactElement<any>>;
  text?: string;
  timeout?: number;
} & {
  [key: string]: Font | string;
};

export interface ObserverContext {
  __fonts: ObserverState;
}

class FontObserver extends React.Component<ObserverProps, ObserverState> {
  static propTypes = {
    children: T.node,
    text: T.string,
    timeout: T.number,
  };

  static defaultProps = {
    children: null,
    text: null,
    timeout: 3000,
  };

  static childContextTypes = {
    __fonts: T.object,
  };

  static contextTypes = {
    __fonts: T.object,
  };

  promises: Array<Cancelable.PCancelable<any>> = [];

  state = {};

  getChildContext() {
    // Merge fonts contexts
    const passedDownFonts = this.context.__fonts;
    const currentFonts = this.state;
    return { __fonts: { ...passedDownFonts, ...currentFonts } };
  }

  componentDidMount() {
    const { children, text, timeout, ...props } = this.props;
    // Keep promises to cancel them once component unmounts
    this.promises = Object.keys(props).map(prop => {
      // Validate stuff
      const origValue = props[prop];
      invariant(
        isObject(origValue) || isString(origValue),
        `Expected font prop to be a string or object, received ${getType(
          origValue,
        )} instead`,
      );
      const value = isObject(origValue) ? origValue : { family: origValue };
      invariant(
        isString(value.family) && value.family.length > 0,
        `Expected font 'family' prop to be a non-empty string, received ${getType(
          value.family,
        )} instead`,
      );
      const { family, ...rest } = value;
      // Allow cancelling FFO promises
      const ffo = new Cancelable((resolve, reject) =>
        new FontFaceObserver(family, rest)
          .load(text, timeout)
          .then(resolve, reject),
      );
      // Update state once resolved
      ffo
        .then(() => this.setState(prev => ({ ...prev, [prop]: value })))
        .catch(reason => !ffo.canceled && Promise.reject(reason));

      return ffo;
    });
  }

  componentWillUnmount() {
    // Mark promises as canceled to avoid setState calls when unmounted
    this.promises.forEach(promise => promise.cancel());
  }

  render() {
    return this.props.children;
  }
}

export default FontObserver;

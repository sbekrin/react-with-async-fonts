import * as React from 'react';
import * as T from 'prop-types';
import FontFaceObserver from 'fontfaceobserver';
import Cancelable from 'p-cancelable';
import invariant from 'invariant';

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
  [key: string]: Font | string;
}

export type ObserverProps = {
  children: React.ReactElement<any>;
} & ObserverState;

class FontObserver extends React.Component<ObserverProps, ObserverState> {
  static childContextTypes = {
    __fonts: T.object,
  };

  promises: Array<
    Promise<any> & {
      cancel: () => void;
      canceled: boolean;
    }
  > = [];

  getChildContext() {
    return { __fonts: this.state };
  }

  componentDidMount() {
    const { children, ...props } = this.props;
    // Keep promises to be able cancel them once component unmounts
    this.promises = Object.keys(props)
      .map(prop => {
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
          `Expected font 'family' prop to be a non-empty string, received `,
        );
        const { family, ...rest } = value;
        // Allow cancelling FFO promises
        return Cancelable.fn(() =>
          new FontFaceObserver(family, rest).load().then(() => {
            // Update state once font is ready
            this.setState({ [prop]: value });
          }),
        );
      })
      .map(promise =>
        // Catch errors if promise was canceled
        promise.catch(
          reason => (promise.canceled ? null : Promise.reject(reason)),
        ),
      );
  }

  componentWillUnmount() {
    this.promises.forEach(promise => promise.cancel());
  }

  render() {
    return this.props.children;
  }
}

export default FontObserver;

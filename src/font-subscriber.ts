import * as React from 'react';
import * as T from 'prop-types';
import { ObserverContext, ObserverState } from './font-observer';

export interface SubscriberProps {
  children: (fonts: ObserverState) => React.ReactElement<any>;
}

class FontSubscriber extends React.Component<SubscriberProps, {}> {
  static contextTypes = {
    __fonts: T.object,
  };

  static propTypes = {
    children: T.func.isRequired,
  };

  context: ObserverContext;

  render() {
    return this.props.children(this.context.__fonts);
  }
}

export default FontSubscriber;

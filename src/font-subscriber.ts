import * as React from 'react';
import * as T from 'prop-types';

export interface SubscriberProps {
  children: ({}) => React.ReactElement<any>;
}

class FontSubscriber extends React.Component<SubscriberProps, {}> {
  static contextTypes = {
    __fonts: T.object,
  };

  static propTypes = {
    children: T.func.isRequired,
  };

  render() {
    return this.props.children(this.context.__fonts);
  }
}

export default FontSubscriber;

import * as React from 'react';
import * as T from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import FontSubscriber from './font-subscriber';

const h = React.createElement;

function withFonts(Target) {
  const Composed = props =>
    h(FontSubscriber, {
      children: fonts => h(Target, { ...props, fonts }),
    });
  return hoistStatics(Composed, Target);
}

export default withFonts;

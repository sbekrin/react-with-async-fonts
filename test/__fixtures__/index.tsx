import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FontObserver, FontSubscriber } from '../../';

// See https://github.com/Microsoft/TypeScript/issues/11152
const props: any = { roboto900: { family: 'Roboto', weight: '900' }};

ReactDOM.render(
  <FontObserver {...props}>
    <FontSubscriber>
      {fonts => (
        <h1 className={fonts.roboto900 ? 'roboto900-font' : 'system-font'}>
          Hello
        </h1>
      )}
    </FontSubscriber>
  </FontObserver>,
  document.getElementById('root'),
);

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FontObserver, FontSubscriber } from '../../';

ReactDOM.render(
  <FontObserver roboto900={{ family: 'Roboto', weight: '900' }}>
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

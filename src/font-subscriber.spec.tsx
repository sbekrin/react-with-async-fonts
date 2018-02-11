import * as React from 'react';
import { shallow } from 'enzyme';
import { FontSubscriber } from './index';

describe('<FontSubscriber />', () => {
  it('only accepts function child', () => {
    // Make console.error to throw to catch it with .toThrow
    global.console.error = jest.fn(reason => {
      throw new Error(reason);
    });
    expect(() => (
      <FontSubscriber>Hello</FontSubscriber>
    )).toThrowErrorMatchingSnapshot();
    // Reset console hack
    global.console.error.mockReset();
  });

  it('calls function child with fonts context', () => {
    const funcChild = jest.fn();
    shallow(<FontSubscriber>{funcChild}</FontSubscriber>, {
      context: { __fonts: { openSans: { family: 'Open Sans' } } },
    });
    expect(funcChild).toHaveBeenCalledWith({
      openSans: { family: 'Open Sans' },
    });
  });
});

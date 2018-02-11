import * as React from 'react';
import * as T from 'prop-types';
import { mount } from 'enzyme';
import { withFonts } from './index';

describe('withFonts()', () => {
  it('injects fonts prop', async () => {
    const Test = jest.fn().mockReturnValue(<div />);
    const TestWithFonts = withFonts(Test);
    mount(<TestWithFonts />, {
      context: { __fonts: { openSans: { family: 'Open Sans' } } },
      childContextTypes: { __fonts: T.object },
    });
    expect(Test).toHaveBeenCalledWith(
      { fonts: { openSans: { family: 'Open Sans' } } },
      expect.any(Object),
    );
  });
});

import * as React from 'react';
import * as T from 'prop-types';
import * as FontFaceObserver from 'fontfaceobserver';
import { shallow, mount } from 'enzyme';
import { FontObserver } from './index';

describe('<FontObserver />', () => {
  let ffoLoadSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    ffoLoadSpy = jest.spyOn(FontFaceObserver.prototype, 'load');
    ffoLoadSpy.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    ffoLoadSpy.mockReset();
    jest.useRealTimers();
  });

  it('validates font props', () => {
    expect(() =>
      shallow(<FontObserver foo={42} />),
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      shallow(<FontObserver bar={{ family: [] }} />),
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      shallow(<FontObserver baz={{ family: null }} />),
    ).toThrowErrorMatchingSnapshot();
  });

  it('reflects font loading on state', async () => {
    const wrapper = shallow(<FontObserver openSans="Open Sans" />);
    // not sure how to flush promises in more elegant way with Jest
    await Promise.resolve();
    await Promise.resolve();
    expect(wrapper.state().openSans).toEqual({ family: 'Open Sans' });
  });

  it('passes text and timeout options to FFO', () => {
    mount(<FontObserver text="foo" timeout={5000} openSans="Open Sans" />);
    jest.runOnlyPendingTimers();
    expect(ffoLoadSpy).toHaveBeenCalledWith('foo', 5000);
  });

  it('cancels FFO promises before it unmounts', () => {
    ffoLoadSpy.mockImplementation(() => new Promise(r => setTimeout(r, 5000)));
    mount(<FontObserver openSans="Open Sans" />).unmount();
    jest.runOnlyPendingTimers();
  });

  it('merges with parent context', async () => {
    const Test = jest.fn().mockReturnValue(<span />);
    Test.contextTypes = { __fonts: T.object };
    mount(
      <FontObserver openSans="Open Sans">
        <FontObserver roboto="Roboto">
          <FontObserver ptSans="PT Sans">
            <Test />
          </FontObserver>
        </FontObserver>
      </FontObserver>,
    );
    await Promise.resolve();
    await Promise.resolve();
    expect(Test).toHaveBeenCalledWith(expect.any(Object), {
      __fonts: {
        openSans: expect.any(Object),
        roboto: expect.any(Object),
        ptSans: expect.any(Object),
      },
    });
  });
});

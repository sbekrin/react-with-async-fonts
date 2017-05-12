import { Font, InputFont, LoadedFont, FallbackFont } from './types';
import {
    load,
    dataWithLoadingFont,
    dataWithLoadedFont,
    dataWithFailedFont,
} from './helpers';

describe('Helpers', () => {
    describe('load()', () => {
        it('load() should return a promise', () => {
            const observer = load({ family: 'foo' }, 5000);
            expect(observer instanceof Promise).toBeTruthy();
        });
    });

    describe('dataWithLoadingFont()', () => {
        it('should map basic font data only', () => {
            const actual = dataWithLoadingFont({
                family: 'Foo',
                foo: 'bar',
                baz: 42,
            });

            expect(actual.foo).toBeUndefined();
            expect(actual.baz).toBeUndefined();
        });

        it('should map all font props', () => {
            const input: InputFont = {
                family: 'Foo',
                weight: 300,
                stretch: 'expanded',
                style: 'oblique',
            };

            const expected: Font = {
                family: 'Foo',
                weight: 300,
                stretch: 'expanded',
                style: 'oblique',
                styles: {},
                class: '',
            };

            expect(dataWithLoadingFont(input)).toEqual(expected);
        });

        it('should set initial class and styles', () => {
            const actual = dataWithLoadingFont({
                family: 'Foo',
                class: {
                    initial: 'system-font',
                    success: 'foo-font',
                },
                styles: {
                    initial: {
                        a: 1,
                    },
                    success: {
                        b: 1,
                    },
                },
            });

            expect(actual.class).toEqual('system-font');
            expect(actual.styles).toEqual({ a: 1 });
        });
    });

    describe('dataWithLoadedFont', () => {
        it('dataWithLoadedFont should use default values for class and styles props', () => {
            const input: InputFont = {
                family: 'Foo',
            };

            const expected: LoadedFont = {
                family: 'Foo',
                class: '',
                styles: {},
                timing: expect.any(Number),
            };

            expect(dataWithLoadedFont(input)).toEqual(expected);
        });

        it('dataWithLoadedFont should map full font data', () => {
            const input: InputFont = {
                family: 'Foo',
                custom: 42,
                class: {
                    success: 'foo-font-loaded',
                },
                styles: {
                    success: {
                        fontFamily: 'Foo, monospace',
                    },
                },
            };

            const expected: LoadedFont = {
                family: 'Foo',
                custom: 42,
                class: 'foo-font-loaded',
                styles: {
                    fontFamily: 'Foo, monospace',
                },
                timing: expect.any(Number),
            };

            expect(dataWithLoadedFont(input)).toEqual(expected);
        });
    });

    describe('dataWithFailedFont()', () => {
        it('should map fallback font data', () => {
            const input: InputFont = {
                family: 'Foo',
                class: {
                    success: 'foo-font',
                    fallback: 'fallback-font',
                },
                styles: {
                    success: {
                        fontFamily: 'Foo, monospace',
                    },
                    fallback: {
                        fontFamily: 'Monaco, monospace',
                    },
                },
            };

            const expected: FallbackFont = {
                family: 'Foo',
                class: 'fallback-font',
                styles: {
                    fontFamily: 'Monaco, monospace',
                },
                error: expect.any(Object),
            };

            expect(dataWithFailedFont(input)).toEqual(expected);
        });

        it('should use default fallback values', () => {
            const input: InputFont = {
                family: 'Foo',
                class: {
                    success: 'bar-font',
                },
            };

            const expected: FallbackFont = {
                family: 'Foo',
                class: '',
                styles: {},
                error: expect.any(Object),
            };

            expect(dataWithFailedFont(input)).toEqual(expected);
        });

        it('should use initial data if no fallback values provided', () => {
            const input: InputFont = {
                family: 'Foo',
                class: {
                    initial: 'system-font',
                    success: 'foo-font',
                },
                styles: {
                    initial: {
                        fontFamily: 'Arial, sans-serif',
                    },
                    success: {
                        fontFamily: 'Foo, sans-serif',
                    },
                },
            };

            const expected: FallbackFont = {
                family: 'Foo',
                class: 'system-font',
                styles: {
                    fontFamily: 'Arial, sans-serif',
                },
                error: expect.any(Error),
            };

            expect(dataWithFailedFont(input)).toEqual(expected);
        });
    });
});

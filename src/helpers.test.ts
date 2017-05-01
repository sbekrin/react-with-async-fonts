import { Font } from './types';
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
        it('should map basic font data', () => {
            const input: Font = {
                family: 'Foo',
                foo: 'bar',
                baz: 42,
            };

            const expected: Font = {
                family: 'Foo',
            };

            expect(dataWithLoadingFont(input)).toEqual(expected);
        });
    });

    it('dataWithLoadedFont should map complete font data', () => {
        const input: Font = {
            family: 'Foo',
            foo: 'bar',
            baz: 42,
            custom: 1,
            styles: {
                fontFamily: 'Foo, monospace',
            },
        };

        const expected: Font = { ...input };

        expect(dataWithLoadedFont(input)).toEqual(expected);
    });

    describe('dataWithLoadingFont()', () => {
        it('should map fallback font data', () => {
            const input: Font = {
                family: 'Foo',
                class: 'foo-font',
                fallbackClass: 'foo-fallback-font',
                styles: {
                    fontFamily: 'Foo, monospace',
                },
                fallbackStyles: {
                    fontFamily: 'Monaco, monospace',
                },
            };

            const expected: Font = {
                family: 'Foo',
                class: 'foo-fallback-font',
                styles: {
                    fontFamily: 'Monaco, monospace',
                },
            };

            expect(dataWithFailedFont(input)).toEqual(expected);
        });

        it('should use default fallback values', () => {
            const input: Font = {
                family: 'Foo',
                class: 'bar-font',
            };

            const expected = {
                family: 'Foo',
                class: '',
                styles: {},
            };

            expect(dataWithFailedFont(input)).toEqual(expected);
        });
    });
});

import { describe, expect, it } from 'vitest';
import * as acorn from 'acorn';
import { AttrError, evaluateExpression } from '$lib/markdown/attr-grammar';

const ev = (code: string) =>
	evaluateExpression(acorn.parseExpressionAt(code, 0, { ecmaVersion: 'latest' }) as never);

describe('attribute grammar', () => {
	it('reads literal values', () => {
		expect(ev('2')).toBe(2);
		expect(ev("'hello'")).toBe('hello');
		expect(ev('true')).toBe(true);
		expect(ev('false')).toBe(false);
		expect(ev('null')).toBe(null);
		expect(ev('-5')).toBe(-5);
		expect(ev('!true')).toBe(false);
	});

	it('reads arrays and objects', () => {
		expect(ev("[1, 'a', true]")).toEqual([1, 'a', true]);
		expect(ev('{ a: 1, b: false }')).toEqual({ a: 1, b: false });
		expect(ev("{ 'k-1': 1, nested: { x: 2 } }")).toEqual({ 'k-1': 1, nested: { x: 2 } });
	});

	it('reads template literals without interpolation', () => {
		expect(ev('`/pets/{id}`')).toBe('/pets/{id}');
	});

	it('rejects code, the no-eval guarantee', () => {
		expect(() => ev('doThing()')).toThrow(AttrError);
		expect(() => ev('someVar')).toThrow(AttrError);
		expect(() => ev('`a${x}b`')).toThrow(AttrError);
		expect(() => ev('/regex/')).toThrow(AttrError);
		expect(() => ev('[...rest]')).toThrow(AttrError);
		expect(() => ev('a + b')).toThrow(AttrError);
	});
});

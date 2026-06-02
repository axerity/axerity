import { describe, expect, it } from 'vitest';
import {
	describe as describeSchema,
	escapeText,
	sample,
	slugify,
	typeLabel
} from '$lib/openapi/generate';

const spec = {
	components: {
		schemas: {
			Pet: { type: 'object', properties: { id: { type: 'string' } } }
		}
	}
};

describe('slugify', () => {
	it('lowercases and dashes', () => {
		expect(slugify('listPets')).toBe('listpets');
		expect(slugify('Store APIs')).toBe('store-apis');
		expect(slugify('User_Name')).toBe('user-name');
	});
	it('unwraps path templates', () => {
		expect(slugify('/pets/{petId}')).toBe('pets-petid');
		expect(slugify('get-/pets')).toBe('get-pets');
	});
});

describe('escapeText', () => {
	it('escapes markup and brace characters', () => {
		expect(escapeText('a < b')).toBe('a &lt; b');
		expect(escapeText('use {value}')).toBe('use &#123;value&#125;');
		expect(escapeText('plain text')).toBe('plain text');
	});
});

describe('typeLabel', () => {
	it('labels primitives, formats, refs, arrays, unions, enums', () => {
		expect(typeLabel(spec, { type: 'string' })).toBe('string');
		expect(typeLabel(spec, { type: 'string', format: 'date-time' })).toBe('date-time');
		expect(typeLabel(spec, { type: 'integer' })).toBe('integer');
		expect(typeLabel(spec, { $ref: '#/components/schemas/Pet' })).toBe('Pet');
		expect(typeLabel(spec, { type: 'array', items: { type: 'string' } })).toBe('array of string');
		expect(typeLabel(spec, { type: 'array', items: { $ref: '#/components/schemas/Pet' } })).toBe(
			'array of Pet'
		);
		expect(typeLabel(spec, { oneOf: [{ type: 'string' }, { type: 'integer' }] })).toBe(
			'string or integer'
		);
		expect(typeLabel(spec, { enum: ['a', 'b'] })).toBe('enum');
		expect(typeLabel(spec, { type: ['string', 'null'] })).toBe('string');
		expect(typeLabel(spec, undefined)).toBe('any');
	});
});

describe('describe (schema notes)', () => {
	it('formats description and constraints', () => {
		expect(describeSchema({ description: 'A pet.' })).toBe('A pet.');
		expect(describeSchema({ enum: ['a', 'b'] })).toBe('(one of `a`, `b`)');
		expect(describeSchema({ description: 'X', format: 'email' })).toBe('X (format `email`)');
		expect(describeSchema({ minLength: 2, maxLength: 10 })).toBe('(length 2–10)');
		expect(describeSchema({ minimum: 0, maximum: 100 })).toBe('(range 0–100)');
		expect(describeSchema({ default: 5 })).toBe('(defaults to `5`)');
		expect(describeSchema({ readOnly: true })).toBe('(read-only)');
		expect(describeSchema({ deprecated: true })).toBe('(deprecated)');
		expect(describeSchema({ pattern: '^a' })).toBe('(pattern `^a`)');
		expect(describeSchema({})).toBe('');
	});
});

describe('sample (example synthesis)', () => {
	it('prefers explicit example, then default, then enum, then type', () => {
		expect(sample(spec, { example: 'hi' })).toBe('hi');
		expect(sample(spec, { default: 5 })).toBe(5);
		expect(sample(spec, { enum: ['a', 'b'] })).toBe('a');
		expect(sample(spec, { type: 'integer' })).toBe(0);
		expect(sample(spec, { type: 'boolean' })).toBe(true);
		expect(sample(spec, { type: 'string' })).toBe('string');
		expect(sample(spec, { type: 'string', format: 'date-time' })).toBe('2024-01-01T00:00:00Z');
	});
	it('builds arrays and objects', () => {
		expect(sample(spec, { type: 'array', items: { type: 'string' } })).toEqual(['string']);
		expect(
			sample(spec, {
				type: 'object',
				properties: { id: { type: 'string' }, n: { type: 'integer' } }
			})
		).toEqual({ id: 'string', n: 0 });
	});
	it('resolves $ref through the spec', () => {
		expect(sample(spec, { $ref: '#/components/schemas/Pet' })).toEqual({ id: 'string' });
	});
});

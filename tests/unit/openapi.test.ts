import { afterAll, describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

process.env.AXERITY_MOUNTED = '1';
const { generateApiDocs } = await import('$lib/openapi/generate');

const dir = mkdtempSync(join(tmpdir(), 'axerity-openapi-'));
const specPath = join(dir, 'spec.json');
const contentRoot = join(dir, 'content');

const spec = {
	openapi: '3.0.0',
	info: { title: 'Test API', version: '1.0.0' },
	servers: [{ url: 'https://api.test/v1' }],
	tags: [{ name: 'Pets' }],
	paths: {
		'/pets': {
			get: {
				operationId: 'listPets',
				tags: ['Pets'],
				summary: 'List pets',
				responses: { '200': { description: 'ok' } }
			}
		}
	},
	components: {
		schemas: { Pet: { type: 'object', properties: { id: { type: 'string' } } } }
	}
};
writeFileSync(specPath, JSON.stringify(spec));

afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('generateApiDocs', () => {
	it('generates reference pages from a spec', async () => {
		const written = await generateApiDocs(
			[{ spec: specPath, output: 'api-ref', title: 'Test API' }],
			contentRoot
		);
		expect(written.length).toBeGreaterThan(0);

		const groupMeta = join(contentRoot, 'api-ref', 'meta.json');
		expect(existsSync(groupMeta)).toBe(true);
		expect(JSON.parse(readFileSync(groupMeta, 'utf8')).title).toBe('Test API');

		expect(existsSync(join(contentRoot, 'api-ref', 'schemas', 'meta.json'))).toBe(true);
		expect(written.some((f) => f.endsWith('.md'))).toBe(true);
	});
});

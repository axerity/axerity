import { afterAll, describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

process.env.AXERITY_MOUNTED = '1';
const { generateApiDocs } = await import('$lib/openapi/generate');

const dirs: string[] = [];
afterAll(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));

async function gen(content: unknown, output = 'api', ext: 'json' | 'yaml' = 'json') {
	const dir = mkdtempSync(join(tmpdir(), 'axerity-openapi-'));
	dirs.push(dir);
	const specPath = join(dir, `spec.${ext}`);
	writeFileSync(specPath, ext === 'json' ? JSON.stringify(content) : String(content));
	const root = join(dir, 'content');
	const written = await generateApiDocs([{ spec: specPath, output }], root);
	const at = (rel: string) => join(root, output, rel);
	return {
		written,
		read: (rel: string) => readFileSync(at(rel), 'utf8'),
		json: (rel: string) => JSON.parse(readFileSync(at(rel), 'utf8')),
		exists: (rel: string) => existsSync(at(rel)),
		root
	};
}

const petSpec = {
	info: { title: 'Pet API' },
	servers: [{ url: 'https://api.test/v1' }],
	tags: [{ name: 'Pets' }],
	paths: {
		'/pets': {
			get: {
				operationId: 'listPets',
				tags: ['Pets'],
				summary: 'List',
				responses: { '200': { description: 'ok' } }
			},
			post: {
				operationId: 'createPet',
				tags: ['Pets'],
				summary: 'Create',
				responses: { '201': { description: 'created' } }
			}
		}
	},
	webhooks: {
		petCreated: {
			post: {
				operationId: 'petCreated',
				summary: 'Pet created',
				responses: { '200': { description: 'ok' } }
			}
		}
	},
	components: { schemas: { Pet: { type: 'object', properties: { id: { type: 'string' } } } } }
};

describe('generateApiDocs', () => {
	it('writes the group meta with tag and schema sections', async () => {
		const out = await gen(petSpec);
		expect(out.json('meta.json')).toEqual({
			title: 'Pet API',
			icon: 'code',
			pages: ['pets', 'webhooks', 'schemas']
		});
	});

	it('writes a page and ordered meta per tag', async () => {
		const out = await gen(petSpec);
		expect(out.json('pets/meta.json')).toEqual({ title: 'Pets', pages: ['listpets', 'createpet'] });
		expect(out.exists('pets/listpets.md')).toBe(true);
		expect(out.exists('pets/createpet.md')).toBe(true);
	});

	it('collects webhooks under their own section', async () => {
		const out = await gen(petSpec);
		expect(out.exists('webhooks/petcreated.md')).toBe(true);
		expect(out.json('webhooks/meta.json').title).toBe('Webhooks');
	});

	it('writes a schema page and schema meta', async () => {
		const out = await gen(petSpec);
		expect(out.json('schemas/meta.json')).toEqual({
			title: 'Schemas',
			icon: 'box',
			pages: ['pet']
		});
		expect(out.read('schemas/pet.md')).toContain('# Pet');
	});

	it('parses a YAML spec', async () => {
		const yaml = [
			'openapi: 3.0.0',
			'info:',
			'  title: YAML API',
			'paths:',
			'  /ping:',
			'    get:',
			'      operationId: ping',
			'      responses:',
			"        '200':",
			'          description: ok'
		].join('\n');
		const out = await gen(yaml, 'api', 'yaml');
		expect(out.exists('default/ping.md')).toBe(true);
	});

	it('generates a separate group per source', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'axerity-openapi-multi-'));
		dirs.push(dir);
		const a = join(dir, 'a.json');
		const b = join(dir, 'b.json');
		writeFileSync(a, JSON.stringify(petSpec));
		writeFileSync(b, JSON.stringify(petSpec));
		const root = join(dir, 'content');
		await generateApiDocs(
			[
				{ spec: a, output: 'first' },
				{ spec: b, output: 'second' }
			],
			root
		);
		expect(existsSync(join(root, 'first', 'meta.json'))).toBe(true);
		expect(existsSync(join(root, 'second', 'meta.json'))).toBe(true);
	});

	it('skips a missing spec without throwing', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'axerity-openapi-missing-'));
		dirs.push(dir);
		const root = join(dir, 'content');
		const written = await generateApiDocs([{ spec: join(dir, 'nope.json'), output: 'x' }], root);
		expect(written).toEqual([]);
		expect(existsSync(join(root, 'x'))).toBe(false);
	});
});

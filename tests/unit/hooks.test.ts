import { afterAll, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const dir = mkdtempSync(join(tmpdir(), 'axerity-hooks-'));
const configPath = join(dir, 'axerity.json');
process.env.AXERITY_CONFIG = configPath;
writeFileSync(
	configPath,
	JSON.stringify({
		name: 'X',
		topNav: [],
		theme: 'stripe',
		brand: { accent: '#ff0000', radius: '1rem' }
	})
);

const { handle, handleError } = await import('../../src/hooks.server');

afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('handle', () => {
	it('injects the theme and brand style into the page', async () => {
		const event = { url: new URL('http://localhost/page') };
		const resolve = (_ev: unknown, opts: { transformPageChunk: (c: { html: string }) => string }) =>
			opts.transformPageChunk({ html: '<html><head></head><body>hi</body></html>' });
		const html = await handle({ event, resolve } as never);
		expect(html).toContain('data-theme="stripe"');
		expect(html).toContain('<style>');
		expect(html).toContain('--accent:#ff0000');
	});
});

describe('handleError', () => {
	it('returns a clean message from an Error', () => {
		const out = handleError({
			error: new Error('boom'),
			event: { url: new URL('http://localhost/x') }
		} as never);
		expect(out).toEqual({ message: 'boom' });
	});
});

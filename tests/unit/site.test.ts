import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const dir = mkdtempSync(join(tmpdir(), 'axerity-site-'));
const configPath = join(dir, 'axerity.json');
process.env.AXERITY_CONFIG = configPath;
process.env.AXERITY_DEV = '1';

const write = (config: object) => writeFileSync(configPath, JSON.stringify(config));
write({ name: 'X', topNav: [] });

const { getSite } = await import('$lib/server/site');

afterAll(() => rmSync(dir, { recursive: true, force: true }));
beforeEach(() => write({ name: 'X', topNav: [] }));

describe('getSite asset normalization', () => {
	it('normalizes a relative logo path to root-absolute', () => {
		write({ name: 'X', topNav: [], logo: { light: './docs/logo.png', dark: '/img/d.png' } });
		const site = getSite();
		expect(site.logo?.light).toBe('/docs/logo.png');
		expect(site.logo?.dark).toBe('/img/d.png');
	});

	it('normalizes favicon and og.logo', () => {
		write({ name: 'X', topNav: [], favicon: './favicon.png', og: { logo: 'logo.svg' } });
		const site = getSite();
		expect(site.favicon).toBe('/favicon.png');
		expect(site.og?.logo).toBe('/logo.svg');
	});

	it('leaves absolute http urls untouched', () => {
		write({ name: 'X', topNav: [], logo: { light: 'https://cdn.example.com/l.png' } });
		expect(getSite().logo?.light).toBe('https://cdn.example.com/l.png');
	});
});

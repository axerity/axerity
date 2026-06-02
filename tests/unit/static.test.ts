import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { isAsset, mimeFor, resolveAsset, walkAssets } from '../../runtime/static.js';

describe('isAsset and mimeFor', () => {
	it('recognizes asset extensions only', () => {
		expect(isAsset('logo.png')).toBe(true);
		expect(isAsset('icon.svg')).toBe(true);
		expect(isAsset('readme.md')).toBe(false);
		expect(isAsset('config.json')).toBe(false);
	});

	it('maps known mime types', () => {
		expect(mimeFor('x.png')).toBe('image/png');
		expect(mimeFor('x.svg')).toBe('image/svg+xml');
		expect(mimeFor('x.woff2')).toBe('font/woff2');
	});
});

describe('resolveAsset', () => {
	const root = mkdtempSync(join(tmpdir(), 'axerity-static-'));

	beforeAll(() => {
		mkdirSync(join(root, 'img'), { recursive: true });
		writeFileSync(join(root, 'img', 'a.png'), 'x');
		writeFileSync(join(root, 'secret.json'), 'x');
	});
	afterAll(() => rmSync(root, { recursive: true, force: true }));

	it('resolves an asset inside the root', () => {
		expect(resolveAsset(root, '/img/a.png')).toBe(join(root, 'img', 'a.png'));
	});

	it('rejects a non-asset extension', () => {
		expect(resolveAsset(root, '/secret.json')).toBe(null);
	});

	it('rejects path traversal that escapes the root', () => {
		expect(resolveAsset(root, '/img/../../escape.png')).toBe(null);
		expect(resolveAsset(root, '/%2e%2e/%2e%2e/escape.png')).toBe(null);
	});

	it('returns null for a missing file', () => {
		expect(resolveAsset(root, '/img/missing.png')).toBe(null);
	});
});

describe('walkAssets', () => {
	it('yields asset files and skips ignored dirs and non-assets', () => {
		const root = mkdtempSync(join(tmpdir(), 'axerity-walk-'));
		mkdirSync(join(root, 'node_modules'), { recursive: true });
		mkdirSync(join(root, 'images'), { recursive: true });
		writeFileSync(join(root, 'images', 'hero.png'), 'x');
		writeFileSync(join(root, 'node_modules', 'pkg.png'), 'x');
		writeFileSync(join(root, 'doc.md'), 'x');

		const found = [...walkAssets(root)].map((a) => a.rel.replace(/\\/g, '/'));
		expect(found).toContain('images/hero.png');
		expect(found).not.toContain('node_modules/pkg.png');
		expect(found.some((f) => f.endsWith('.md'))).toBe(false);

		rmSync(root, { recursive: true, force: true });
	});
});

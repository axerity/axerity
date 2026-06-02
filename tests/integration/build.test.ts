import { afterEach, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const engineRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../..');
const bin = join(engineRoot, 'bin', 'axerity.js');
const distReady = existsSync(join(engineRoot, 'dist', 'handler.js'));

const baseConfig = {
	name: 'Fixture',
	description: 'A fixture site.',
	url: 'https://fixture.test',
	theme: 'neutral',
	topNav: [{ title: 'Docs', href: '/' }]
};

const fixtures: string[] = [];
function fixture(pages: Record<string, string>, meta: object): string {
	const dir = mkdtempSync(join(tmpdir(), 'axerity-build-'));
	fixtures.push(dir);
	mkdirSync(join(dir, 'docs'), { recursive: true });
	writeFileSync(join(dir, 'axerity.json'), JSON.stringify(baseConfig));
	writeFileSync(join(dir, 'docs', 'meta.json'), JSON.stringify(meta));
	for (const [name, body] of Object.entries(pages)) {
		writeFileSync(join(dir, 'docs', name), body);
	}
	return dir;
}

const build = (cwd: string) =>
	execFileSync(process.execPath, [bin, 'build'], { cwd, encoding: 'utf8', timeout: 90_000 });

afterEach(() => {
	for (const dir of fixtures.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe.skipIf(!distReady)('build (integration)', () => {
	it('crawls a fixture into a static site with feeds and search', () => {
		const dir = fixture(
			{
				'index.md': '---\ntitle: Home\n---\n\n# Home\n\nWelcome.',
				'guide.md': '---\ntitle: Guide\n---\n\n# Guide\n\n## Section\n\nBody.'
			},
			{ title: 'Docs', pages: ['index', 'guide'] }
		);
		build(dir);
		const out = join(dir, 'build');
		expect(existsSync(join(out, 'index.html'))).toBe(true);
		expect(existsSync(join(out, 'guide.html'))).toBe(true);

		const search = JSON.parse(readFileSync(join(out, 'search.json'), 'utf8'));
		expect(Array.isArray(search)).toBe(true);
		expect(
			search.some(
				(d: { title: string; href: string }) => d.title === 'Guide' && d.href === '/guide'
			)
		).toBe(true);

		const sitemap = readFileSync(join(out, 'sitemap.xml'), 'utf8');
		expect(sitemap).toContain('https://fixture.test/guide');

		expect(existsSync(join(out, 'rss.xml'))).toBe(true);
		expect(readFileSync(join(out, 'llms.txt'), 'utf8')).toContain('Guide');
	}, 90_000);

	it('fails the build with a non-zero exit on a broken page', () => {
		const dir = fixture(
			{
				'index.md':
					'---\ntitle: Home\n---\n\n# Home\n\n<Callout type={broken()}>\n\nx\n\n</Callout>'
			},
			{ title: 'Docs', pages: ['index'] }
		);
		expect(() => build(dir)).toThrow();
	}, 90_000);
});

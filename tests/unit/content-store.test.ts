import { afterAll, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const dir = mkdtempSync(join(tmpdir(), 'axerity-content-'));
process.env.AXERITY_CONTENT_DIR = dir;
process.env.AXERITY_DEV = '1';

mkdirSync(join(dir, 'api'), { recursive: true });
writeFileSync(join(dir, 'meta.json'), JSON.stringify({ title: 'Docs', pages: ['index', 'guide'] }));
writeFileSync(join(dir, 'index.md'), '---\ntitle: Home\n---\n\n# Home\n');
writeFileSync(
	join(dir, 'guide.md'),
	'---\ntitle: Guide\nicon: book\n---\n\n# Guide\n\n## Section\n\nbody'
);
writeFileSync(join(dir, 'api', 'meta.json'), JSON.stringify({ title: 'API', pages: ['intro'] }));
writeFileSync(join(dir, 'api', 'intro.md'), '---\ntitle: Intro\n---\n\n# Intro\n');

const store = await import('$lib/server/content-store');

afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('content-store', () => {
	it('walks the content dir into a navigation tree', () => {
		const { sidebar } = store.getNav();
		expect(sidebar.find((s) => s.title === 'Docs')).toBeTruthy();
		expect(sidebar.find((s) => s.title === 'API')).toBeTruthy();
	});

	it('lists slugs, mapping index to the folder path', () => {
		expect(store.allSlugs().sort()).toEqual(['', 'api/intro', 'guide']);
	});

	it('lists source paths', () => {
		expect(store.allSourcePaths().sort()).toEqual(['api/intro.md', 'guide.md', 'index.md']);
	});

	it('reads frontmatter by slug and by path', () => {
		expect(store.frontmatterFor('guide')).toMatchObject({ title: 'Guide', icon: 'book' });
		expect(store.frontmatterFor('')).toMatchObject({ title: 'Home' });
		expect(store.frontmatterByPath('api/intro')).toMatchObject({ title: 'Intro' });
	});

	it('renders a page to a document with toc and source path', async () => {
		const page = await store.render('guide');
		expect(page).toBeTruthy();
		expect(page?.frontmatter.title).toBe('Guide');
		expect(page?.sourcePath).toBe('guide.md');
		expect(page?.toc).toContainEqual({ id: 'section', title: 'Section', depth: 2 });
		expect(Array.isArray(page?.doc)).toBe(true);
	});

	it('returns null for an unknown slug', async () => {
		expect(await store.render('does-not-exist')).toBe(null);
	});

	it('returns the raw markdown with frontmatter stripped', async () => {
		const text = await store.raw('index');
		expect(text).toBe('# Home');
	});

	it('lists every page with slug, frontmatter, and source path', () => {
		const pages = store.allPages();
		expect(pages).toContainEqual(
			expect.objectContaining({ slug: 'guide', sourcePath: 'guide.md' })
		);
	});
});

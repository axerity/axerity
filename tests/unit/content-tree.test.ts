import { describe, expect, it } from 'vitest';
import { buildSidebar, flattenSections } from '$lib/content/tree';
import type { NavEntry } from '$lib/types';

const ROOT = '/src/content/docs';

const maps = {
	pages: {
		[`${ROOT}/index.md`]: { title: 'Home' },
		[`${ROOT}/guide/setup.md`]: { title: 'Setup' },
		[`${ROOT}/guide/usage.md`]: { title: 'Usage' }
	},
	meta: {
		[`${ROOT}/meta.json`]: { title: 'Docs', pages: ['index'] },
		[`${ROOT}/guide/meta.json`]: { title: 'Guide', pages: ['usage', 'setup'] }
	}
};

const links = (items: NavEntry[]) =>
	items.filter((e): e is Extract<NavEntry, { href: string }> => 'href' in e);

describe('buildSidebar', () => {
	it('builds a root section and a folder section', () => {
		const sections = buildSidebar(maps);
		expect(sections.find((s) => s.title === 'Docs')).toBeTruthy();
		expect(sections.find((s) => s.title === 'Guide')).toBeTruthy();
	});

	it('orders pages by the meta.json pages array', () => {
		const guide = buildSidebar(maps).find((s) => s.title === 'Guide')!;
		expect(links(guide.items).map((l) => l.href)).toEqual(['/guide/usage', '/guide/setup']);
	});

	it('maps an index page to the folder path', () => {
		const root = buildSidebar(maps).find((s) => s.title === 'Docs')!;
		expect(links(root.items)[0]).toMatchObject({ title: 'Home', href: '/' });
	});

	it('flattens every link', () => {
		const flat = flattenSections(buildSidebar(maps)).map((l) => l.href);
		expect(flat).toContain('/');
		expect(flat).toContain('/guide/setup');
		expect(flat).toContain('/guide/usage');
	});
});

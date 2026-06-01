import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import type { PageFrontmatter } from '$lib/types';
import type { EntryGenerator, PageLoad } from './$types';

const pages = import.meta.glob<{ default: Component; metadata: PageFrontmatter }>(
	'/src/content/docs/**/*.md',
	{ eager: true }
);

const BASE = '/src/content/docs/';

function pathToSlug(path: string): string {
	const rel = path.slice(BASE.length).replace(/\.md$/, '');
	return rel === 'index' ? '' : rel.replace(/\/index$/, '');
}

export const prerender = true;

export const entries: EntryGenerator = () => {
	return Object.keys(pages).map((path) => ({ slug: pathToSlug(path) }));
};

export const load: PageLoad = ({ params }) => {
	const slug = params.slug;

	const candidates = slug ? [`${BASE}${slug}.md`, `${BASE}${slug}/index.md`] : [`${BASE}index.md`];
	const path = candidates.find((p) => p in pages);

	if (!path) error(404, 'Page not found');

	const mod = pages[path];
	return {
		component: mod.default,
		frontmatter: mod.metadata ?? {},
		sourcePath: path.slice(BASE.length)
	};
};

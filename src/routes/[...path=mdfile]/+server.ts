import { error } from '@sveltejs/kit';
import { base } from '$app/paths';
import { flatPages } from '$lib/content';
import { getRawMarkdown } from '$lib/content/raw';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () =>
	flatPages.map((page) => ({ path: page.href.slice(base.length).replace(/^\//, '') + '.md' }));

export const GET: RequestHandler = async ({ params }) => {
	const slug = params.path.replace(/\.md$/, '');
	const markdown = await getRawMarkdown(slug);

	if (markdown == null) error(404, 'Not found');

	return new Response(markdown, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
};

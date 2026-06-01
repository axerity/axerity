import { site } from '$lib/config/site';
import { flatPages } from '$lib/content';
import { getRawMarkdown } from '$lib/content/raw';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const parts = [`# ${site.name}`];
	if (site.description) parts.push('', `> ${site.description}`);

	for (const page of flatPages) {
		const slug = page.href.replace(/^\/docs\/?/, '');
		const markdown = await getRawMarkdown(slug);
		if (markdown) parts.push('', '---', '', markdown);
	}

	return new Response(parts.join('\n') + '\n', {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
};

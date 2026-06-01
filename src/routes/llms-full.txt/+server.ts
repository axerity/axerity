import { base } from '$app/paths';
import { getSite } from '$lib/server/site';
import { getNav, raw } from '$lib/server/content-store';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const site = getSite();
	const parts = [`# ${site.name}`];
	if (site.description) parts.push('', `> ${site.description}`);

	for (const page of getNav().flatPages) {
		const slug = page.href.slice(base.length).replace(/^\//, '');
		const markdown = await raw(slug);
		if (markdown) parts.push('', '---', '', markdown);
	}

	return new Response(parts.join('\n') + '\n', {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
};

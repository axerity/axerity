import { site } from '$lib/config/site';
import { flatPages } from '$lib/content';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const lines = [`# ${site.name}`, ''];
	if (site.description) lines.push(`> ${site.description}`, '');
	lines.push('## Docs', '');

	for (const page of flatPages) {
		const suffix = page.description ? `: ${page.description}` : '';
		lines.push(`- [${page.title}](${page.href}.md)${suffix}`);
	}

	return new Response(lines.join('\n') + '\n', {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
};

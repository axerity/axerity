import { getSite } from '$lib/server/site';
import { getNav } from '$lib/server/content-store';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const site = getSite();
	const lines = [`# ${site.name}`, ''];
	if (site.description) lines.push(`> ${site.description}`, '');
	lines.push('## Docs', '');

	for (const page of getNav().flatPages) {
		const suffix = page.description ? `: ${page.description}` : '';
		lines.push(`- [${page.title}](${page.href}.md)${suffix}`);
	}

	return new Response(lines.join('\n') + '\n', {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
};

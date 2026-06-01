import { site } from '$lib/config/site';
import { flatPages } from '$lib/content';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
	const origin = site.url ?? url.origin;
	const urls = flatPages
		.map((page) => `\t<url>\n\t\t<loc>${origin}${page.href}</loc>\n\t</url>`)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: { 'content-type': 'application/xml' }
	});
};

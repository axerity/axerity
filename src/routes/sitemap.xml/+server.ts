import { getSite } from '$lib/server/site';
import { getNav } from '$lib/server/content-store';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const origin = getSite().url ?? url.origin;
	const urls = getNav().flatPages
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

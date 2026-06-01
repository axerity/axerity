import { base as basePath } from '$app/paths';
import { getSite } from '$lib/server/site';
import { allPages } from '$lib/server/content-store';
import type { RequestHandler } from './$types';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = () => {
	const site = getSite();
	const origin = (site.url ?? '') + basePath;

	const items = allPages()
		.map((p) => ({ slug: p.slug, fm: p.frontmatter }))
		.filter((entry) => Boolean(entry.fm.date))
		.sort(
			(a, b) => new Date(b.fm.date as string).getTime() - new Date(a.fm.date as string).getTime()
		)
		.map((entry) => {
			const link = `${origin}/${entry.slug}`;
			const title = escapeXml(entry.fm.title ?? entry.slug);
			const description = escapeXml(entry.fm.description ?? '');
			const pubDate = new Date(entry.fm.date as string).toUTCString();
			return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${origin}</link>
    <description>${escapeXml(site.description ?? '')}</description>
${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
};

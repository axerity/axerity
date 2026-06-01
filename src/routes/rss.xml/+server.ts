import { base as basePath } from '$app/paths';
import { site } from '$lib/config/site';
import type { PageFrontmatter } from '$lib/types';
import type { RequestHandler } from './$types';

const pages = import.meta.glob<{ metadata: PageFrontmatter }>('/src/content/docs/**/*.md', {
	eager: true
});

const BASE = '/src/content/docs/';

function pathToSlug(path: string): string {
	const rel = path.slice(BASE.length).replace(/\.md$/, '');
	return rel === 'index' ? '' : rel.replace(/\/index$/, '');
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const prerender = true;

export const GET: RequestHandler = () => {
	const origin = (site.url ?? '') + basePath;

	const items = Object.entries(pages)
		.map(([path, mod]) => ({ slug: pathToSlug(path), fm: mod.metadata ?? {} }))
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

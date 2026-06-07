import { base as basePath } from '$app/paths';
import { getSite } from '$lib/server/site';
import { allPages, render } from '$lib/server/content-store';
import type { DocNode } from '$lib/markdown/types';
import type { RequestHandler } from './$types';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function textOf(nodes: DocNode[]): string {
	let out = '';
	for (const node of nodes) {
		if (node.type === 'text') out += node.value;
		else if (node.type === 'element' || node.type === 'component') out += textOf(node.children);
	}
	return out;
}

function collectUpdates(nodes: DocNode[], out: DocNode[]): void {
	for (const node of nodes) {
		if (node.type === 'component' && node.name === 'Update') out.push(node);
		if ('children' in node && node.children) collectUpdates(node.children, out);
	}
}

interface FeedItem {
	title: string;
	link: string;
	description: string;
	time: number;
}

export const GET: RequestHandler = async () => {
	const site = getSite();
	const origin = (site.url ?? '') + basePath;

	const dated = allPages()
		.map((p) => ({ slug: p.slug, fm: p.frontmatter }))
		.filter((entry) => Boolean(entry.fm.date));

	const items: FeedItem[] = [];

	for (const entry of dated) {
		const link = `${origin}/${entry.slug}`;
		const pageTime = new Date(entry.fm.date as string).getTime();
		const compiled = await render(entry.slug);
		const updates: DocNode[] = [];
		if (compiled) collectUpdates(compiled.doc, updates);

		if (updates.length) {
			for (const node of updates) {
				if (node.type !== 'component') continue;
				const label = typeof node.props.label === 'string' ? node.props.label : '';
				const title = typeof node.props.title === 'string' ? node.props.title : '';
				const description =
					typeof node.props.description === 'string' ? node.props.description : '';
				const dateProp = typeof node.props.date === 'string' ? node.props.date : '';
				const anchor = typeof node.props.anchor === 'string' ? node.props.anchor : '';
				const parsed = new Date(dateProp || label).getTime();
				items.push({
					title: title || label || entry.fm.title || entry.slug,
					link: anchor ? `${link}#${anchor}` : link,
					description: description || textOf(node.children).trim(),
					time: Number.isNaN(parsed) ? pageTime : parsed
				});
			}
			continue;
		}

		items.push({
			title: entry.fm.title ?? entry.slug,
			link,
			description: entry.fm.description ?? '',
			time: pageTime
		});
	}

	const body = items
		.sort((a, b) => b.time - a.time)
		.map(
			(item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid>${item.link}</guid>
      <pubDate>${new Date(item.time).toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${origin}</link>
    <description>${escapeXml(site.description ?? '')}</description>
${body}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
};

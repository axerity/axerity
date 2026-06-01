import { base } from '$app/paths';
import { sidebar } from '$lib/content';
import { getRawMarkdown } from '$lib/content/raw';
import type { NavEntry } from '$lib/types';
import type { RequestHandler } from './$types';

export const prerender = true;

function plainText(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[#>*_`|]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 3000);
}

export const GET: RequestHandler = async () => {
	const docs: Array<{
		id: string;
		title: string;
		section: string;
		description: string;
		content: string;
		href: string;
	}> = [];

	async function walk(entries: NavEntry[], section: string) {
		for (const entry of entries) {
			if ('href' in entry) {
				const slug = entry.href.slice(base.length).replace(/^\//, '');
				const raw = await getRawMarkdown(slug);
				docs.push({
					id: entry.href,
					title: entry.title,
					section,
					description: entry.description ?? '',
					content: raw ? plainText(raw) : '',
					href: entry.href
				});
			} else {
				await walk(entry.items, section);
			}
		}
	}

	for (const group of sidebar) await walk(group.items, group.title);

	return new Response(JSON.stringify(docs), {
		headers: { 'content-type': 'application/json' }
	});
};

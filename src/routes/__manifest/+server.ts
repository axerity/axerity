import { json } from '@sveltejs/kit';
import { base } from '$app/paths';
import { getSite } from '$lib/server/site';
import { allSlugs, allSourcePaths, getNav } from '$lib/server/content-store';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const pages = allSlugs().map((slug) => (slug ? `${base}/${slug}` : `${base}/`));
	const md = getNav().flatPages.map((page) => `${page.href}.md`);
	const og = getSite().og?.enabled
		? allSourcePaths().map((sourcePath) => `${base}/og/${sourcePath.replace(/\.md$/, '')}.png`)
		: [];
	const fixed = ['/search.json', '/sitemap.xml', '/rss.xml', '/llms.txt', '/llms-full.txt'].map(
		(path) => base + path
	);
	return json({ base, pages, md, og, fixed });
};

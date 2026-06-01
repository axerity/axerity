import { error, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { defaultVersionPathOf, isVersioned } from '$lib/content';
import { render } from '$lib/server/content-store';
import { getSite } from '$lib/server/site';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;

	const site = getSite();
	if (!slug && isVersioned(site)) redirect(307, `${base}${defaultVersionPathOf(site)}`);

	const page = await render(slug);
	if (!page) error(404, 'Page not found');

	return {
		doc: page.doc,
		frontmatter: page.frontmatter,
		toc: page.toc,
		sourcePath: page.sourcePath
	};
};

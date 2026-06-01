import { error } from '@sveltejs/kit';
import { raw } from '$lib/server/content-store';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const slug = params.path.replace(/\.md$/, '');
	const markdown = await raw(slug);

	if (markdown == null) error(404, 'Not found');

	return new Response(markdown, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
};

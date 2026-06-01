import { site } from '$lib/config/site';
import type { Handle } from '@sveltejs/kit';

const theme = site.theme ?? 'neutral';

export const handle: Handle = ({ event, resolve }) => {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('<html', `<html data-theme="${theme}"`)
	});
};

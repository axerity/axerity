import { getNav } from '$lib/server/content-store';
import { getSite } from '$lib/server/site';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	return { nav: getNav(), site: getSite() };
};

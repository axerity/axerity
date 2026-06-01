import { error } from '@sveltejs/kit';
import { base } from '$app/paths';
import { site } from '$lib/config/site';
import { renderOgImage } from '$lib/server/og';
import type { PageFrontmatter } from '$lib/types';
import type { EntryGenerator, RequestHandler } from './$types';

const pages = import.meta.glob<{ metadata: PageFrontmatter }>('/src/content/docs/**/*.md', {
	eager: true
});

const BASE = '/src/content/docs/';

const WEIGHTS = [400, 600, 700] as const;
let fontCache: { data: ArrayBuffer; weight: 400 | 600 | 700 }[] | null = null;

async function getFonts(fetch: typeof globalThis.fetch) {
	if (!fontCache) {
		fontCache = await Promise.all(
			WEIGHTS.map(async (weight) => {
				const response = await fetch(`${base}/fonts/geist-${weight}.ttf`);
				return { data: await response.arrayBuffer(), weight };
			})
		);
	}
	return fontCache;
}

const logoPath = site.og?.logo ?? site.logo?.dark ?? site.logo?.light;
let logoCache: string | null | undefined;

async function getLogo(fetch: typeof globalThis.fetch): Promise<string | undefined> {
	if (logoCache === undefined) {
		if (!logoPath) {
			logoCache = null;
		} else {
			const response = await fetch(logoPath);
			const svg = await response.text();
			logoCache = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
		}
	}
	return logoCache ?? undefined;
}

export const prerender = true;

export const entries: EntryGenerator = () => {
	return Object.keys(pages).map((path) => ({
		slug: `${path.slice(BASE.length).replace(/\.md$/, '')}.png`
	}));
};

export const GET: RequestHandler = async ({ params, fetch }) => {
	const key = params.slug.replace(/\.png$/, '');
	const mod = pages[`${BASE}${key}.md`];
	if (!mod) error(404, 'Not found');

	const fm = mod.metadata ?? {};
	const fonts = await getFonts(fetch);
	const logo = await getLogo(fetch);

	const png = await renderOgImage({
		title: fm.title ?? site.name,
		description: fm.description ?? site.description,
		siteName: site.name,
		og: site.og,
		fonts,
		logo
	});

	return new Response(new Uint8Array(png), {
		headers: {
			'content-type': 'image/png',
			'cache-control': 'public, max-age=31536000, immutable'
		}
	});
};

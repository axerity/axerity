import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { error } from '@sveltejs/kit';
import { getSite } from '$lib/server/site';
import { renderOgImage } from '$lib/server/og';
import { frontmatterByPath } from '$lib/server/content-store';
import type { RequestHandler } from './$types';

const ASSETS = process.env.AXERITY_ASSETS ?? 'static';
const WEIGHTS = [400, 600, 700] as const;
let fontCache: { data: ArrayBuffer; weight: 400 | 600 | 700 }[] | null = null;

function getFonts() {
	if (!fontCache) {
		fontCache = WEIGHTS.map((weight) => {
			const buf = readFileSync(join(ASSETS, 'fonts', `geist-${weight}.ttf`));
			return { data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), weight };
		});
	}
	return fontCache;
}

let logoCache: string | null | undefined;

function getLogo(): string | undefined {
	const site = getSite();
	const logoPath = site.og?.logo ?? site.logo?.dark ?? site.logo?.light;
	if (logoCache === undefined) {
		if (!logoPath) {
			logoCache = null;
		} else {
			try {
				const svg = readFileSync(join(ASSETS, logoPath.replace(/^\//, '')), 'utf8');
				logoCache = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
			} catch {
				logoCache = null;
			}
		}
	}
	return logoCache ?? undefined;
}

export const GET: RequestHandler = async ({ params }) => {
	const key = params.slug.replace(/\.png$/, '');
	const fm = frontmatterByPath(key);
	if (!fm) error(404, 'Not found');
	const fonts = getFonts();
	const logo = getLogo();
	const site = getSite();

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

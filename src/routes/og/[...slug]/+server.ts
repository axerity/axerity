import { readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { error } from '@sveltejs/kit';
import { base } from '$app/paths';
import { getSite } from '$lib/server/site';
import { renderOgImage } from '$lib/server/og';
import { frontmatterByPath } from '$lib/server/content-store';
import type { RequestHandler } from './$types';

const ASSETS = process.env.AXERITY_ASSETS ?? 'static';
const STATIC_DIR = process.env.AXERITY_STATIC_DIR;

const LOGO_MIME: Record<string, string> = {
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.webp': 'image/webp'
};
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
		logoCache = null;
		const mime = logoPath && LOGO_MIME[extname(logoPath).toLowerCase()];
		if (logoPath && mime) {
			const rel = logoPath.replace(base, '').replace(/^\/+/, '');
			for (const root of [STATIC_DIR, ASSETS]) {
				if (!root) continue;
				try {
					const buf = readFileSync(join(root, rel));
					logoCache = `data:${mime};base64,${buf.toString('base64')}`;
					break;
				} catch {
					continue;
				}
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

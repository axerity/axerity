import { readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { error } from '@sveltejs/kit';
import { base } from '$app/paths';
import { getSite } from '$lib/server/site';
import { renderOgImage } from '$lib/server/og';
import { frontmatterByPath, getNav } from '$lib/server/content-store';
import type { NavEntry } from '$lib/types';
import type { RequestHandler } from './$types';

const LOGO_HEIGHT = 46;

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

interface LoadedLogo {
	src: string;
	width: number;
	height: number;
}

function imageDims(buf: Buffer, mime: string): { w: number; h: number } | null {
	if (mime === 'image/png') return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
	if (mime === 'image/svg+xml') {
		const text = buf.toString('utf8');
		const vb = text.match(/viewBox\s*=\s*["']\s*[\d.]+[ ,]+[\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)/);
		if (vb) return { w: parseFloat(vb[1]), h: parseFloat(vb[2]) };
		const w = text.match(/\bwidth\s*=\s*["']([\d.]+)/);
		const h = text.match(/\bheight\s*=\s*["']([\d.]+)/);
		if (w && h) return { w: parseFloat(w[1]), h: parseFloat(h[1]) };
	}
	return null;
}

let logoCache: LoadedLogo | null | undefined;

function getLogo(): LoadedLogo | undefined {
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
					const dims = imageDims(buf, mime);
					const aspect = dims ? dims.w / dims.h : 1;
					logoCache = {
						src: `data:${mime};base64,${buf.toString('base64')}`,
						width: Math.round(LOGO_HEIGHT * aspect),
						height: LOGO_HEIGHT
					};
					break;
				} catch {
					continue;
				}
			}
		}
	}
	return logoCache ?? undefined;
}

function eyebrowFor(key: string): string | undefined {
	const clean = key.replace(/\/index$/, '');
	const target = clean === 'index' || clean === '' ? `${base}/` : `${base}/${clean}`;
	const hrefsOf = (items: NavEntry[]): string[] =>
		items.flatMap((entry) => ('href' in entry ? [entry.href] : hrefsOf(entry.items)));
	for (const section of getNav().sidebar) {
		if (hrefsOf(section.items).includes(target)) return section.title;
	}
	return undefined;
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
		eyebrow: eyebrowFor(key),
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

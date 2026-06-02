import { getSite } from '$lib/server/site';
import type { BrandConfig } from '$lib/types';
import type { Handle, HandleServerError } from '@sveltejs/kit';

// Reject anything that could break out of the <style> block. Config is authored
// by the site owner, but this keeps a stray brace or tag from corrupting the CSS.
const clean = (value: string) => value.replace(/[<>{}]/g, '').trim();

function brandStyle(brand?: BrandConfig): string {
	if (!brand) return '';

	const light: string[] = [];
	const dark: string[] = [];

	if (brand.accent) {
		const accent = clean(brand.accent);
		const accentDark = clean(brand.accentDark ?? brand.accent);
		light.push(`--accent:${accent}!important`);
		light.push(`--accent-hover:color-mix(in oklab, ${accent} 85%, #000)!important`);
		dark.push(`--accent:${accentDark}!important`);
		dark.push(`--accent-hover:color-mix(in oklab, ${accentDark} 85%, #fff)!important`);
	}
	if (brand.accentContrast) {
		light.push(`--accent-contrast:${clean(brand.accentContrast)}!important`);
	}
	if (brand.radius) {
		const r = clean(brand.radius);
		light.push(`--theme-radius-sm:calc(${r} * 0.25)!important`);
		light.push(`--theme-radius-md:calc(${r} * 0.5)!important`);
		light.push(`--theme-radius-lg:${r}!important`);
		light.push(`--theme-radius-xl:calc(${r} * 1.5)!important`);
		light.push(`--theme-radius-2xl:calc(${r} * 2)!important`);
	}

	if (!light.length && !dark.length) return '';
	const css = `:root{${light.join(';')}}${dark.length ? `.dark{${dark.join(';')}}` : ''}`;
	return `<style>${css}</style>`;
}

const liveReload =
	process.env.AXERITY_DEV === '1'
		? `<script>(function(){var s=new EventSource('/__axerity_livereload');s.onmessage=function(e){if(e.data==='reload')location.reload()}})()</script>`
		: '';

export const handleError: HandleServerError = ({ error, event }) => {
	const message = error instanceof Error ? error.message : String(error);
	const tty = process.stderr.isTTY;
	const mark = tty ? '\x1b[31m✗\x1b[0m' : '✗';
	const sep = tty ? '\x1b[2m—\x1b[0m' : '—';
	process.stderr.write(`  ${mark} ${event.url.pathname} ${sep} ${message}\n`);
	return { message };
};

export const handle: Handle = ({ event, resolve }) => {
	const site = getSite();
	const theme = site.theme ?? 'neutral';
	const brandTag = brandStyle(site.brand);
	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('<html', `<html data-theme="${theme}"`)
				.replace('</head>', `${brandTag}</head>`)
				.replace('</body>', `${liveReload}</body>`)
	});
};

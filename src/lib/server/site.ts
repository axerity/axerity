import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { base } from '$app/paths';
import type { SiteConfig, TopNavLink } from '$lib/types';

const CONFIG = resolve(process.env.AXERITY_CONFIG ?? 'axerity.json');
const DEV = process.env.AXERITY_DEV === '1';

const p = (href?: string): string | undefined =>
	href && href.startsWith('/') ? base + href : href;

const link = (l: TopNavLink): TopNavLink => ({ ...l, href: p(l.href)!, match: p(l.match) });

const asset = (href?: string): string | undefined => {
	if (!href) return href;
	if (/^(https?:)?\/\//.test(href) || href.startsWith('data:')) return href;
	return `${base}/${href.replace(/^\.\//, '').replace(/^\/+/, '')}`;
};

let cache: SiteConfig | null = null;

export function getSite(): SiteConfig {
	if (cache && !DEV) return cache;
	const raw = JSON.parse(readFileSync(CONFIG, 'utf8')) as SiteConfig;
	const result: SiteConfig = {
		...raw,
		logo: raw.logo && {
			...raw.logo,
			light: asset(raw.logo.light),
			dark: asset(raw.logo.dark),
			href: p(raw.logo.href)
		},
		og: raw.og && { ...raw.og, logo: asset(raw.og.logo) },
		topNav: raw.topNav?.map(link),
		versions: raw.versions?.map((v) => ({ ...v, href: p(v.href)! })),
		sidebarLinks: raw.sidebarLinks?.map((s) => ({ ...s, href: p(s.href)! })),
		dropdowns: raw.dropdowns?.map((d) => ({
			...d,
			href: p(d.href)!,
			match: p(d.match),
			tabs: d.tabs?.map(link)
		}))
	};
	if (!DEV) cache = result;
	return result;
}

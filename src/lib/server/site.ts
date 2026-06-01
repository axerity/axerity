import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { base } from '$app/paths';
import type { SiteConfig, TopNavLink } from '$lib/types';

const CONFIG = resolve(process.env.AXERITY_CONFIG ?? 'axerity.json');
const DEV = process.env.AXERITY_DEV === '1';

const p = (href?: string): string | undefined =>
	href && href.startsWith('/') ? base + href : href;

const link = (l: TopNavLink): TopNavLink => ({ ...l, href: p(l.href)!, match: p(l.match) });

let cache: SiteConfig | null = null;

export function getSite(): SiteConfig {
	if (cache && !DEV) return cache;
	const raw = JSON.parse(readFileSync(CONFIG, 'utf8')) as SiteConfig;
	const result: SiteConfig = base
		? {
				...raw,
				logo: raw.logo && {
					...raw.logo,
					light: p(raw.logo.light),
					dark: p(raw.logo.dark),
					href: p(raw.logo.href)
				},
				og: raw.og && { ...raw.og, logo: p(raw.og.logo) },
				topNav: raw.topNav?.map(link) ?? [],
				versions: raw.versions?.map((v) => ({ ...v, href: p(v.href)! })),
				sidebarLinks: raw.sidebarLinks?.map((s) => ({ ...s, href: p(s.href)! })),
				dropdowns: raw.dropdowns?.map((d) => ({
					...d,
					href: p(d.href)!,
					match: p(d.match),
					tabs: d.tabs?.map(link)
				}))
			}
		: raw;
	if (!DEV) cache = result;
	return result;
}

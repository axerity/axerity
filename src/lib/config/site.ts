import { base } from '$app/paths';
import type { SiteConfig, TopNavLink } from '$lib/types';
import config from '../../../axerity.json';

const raw = config as SiteConfig;

// Prefix internal (leading-slash) links with the base path so the whole site
// works under a sub-path. External links and matchers are handled in step.
const p = (href?: string): string | undefined =>
	href && href.startsWith('/') ? base + href : href;

const link = (l: TopNavLink): TopNavLink => ({ ...l, href: p(l.href)!, match: p(l.match) });

export const site: SiteConfig = base
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

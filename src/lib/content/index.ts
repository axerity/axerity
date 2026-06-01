import { base } from '$app/paths';
import { site } from '$lib/config/site';
import type { NavLink, NavSection } from '$lib/types';
import { buildSidebar, flattenSections } from './tree';

const ROOT = '/src/content/docs';

const stripBase = (path: string): string =>
	base && path.startsWith(base) ? path.slice(base.length) : path;

// A versioned site keeps each version's content in a top-level folder matching
// the version's path, e.g. `docs/v2/...` for a version with href `/v2`.
const versionPaths = (site.versions ?? [])
	.map((v) => stripBase(v.href))
	.filter((href) => href && href !== '/');

export const versioned = versionPaths.length > 0;
export const defaultVersionPath = versionPaths[0] ?? '';

const sidebars = new Map<string, NavSection[]>();
if (versioned) {
	for (const path of versionPaths) sidebars.set(path, buildSidebar(ROOT + path));
}

function activeVersionPath(pathname: string): string {
	const path = stripBase(pathname);
	return versionPaths.find((vp) => path === vp || path.startsWith(`${vp}/`)) ?? defaultVersionPath;
}

/** The sidebar and prev/next list for the version the pathname belongs to. */
export function navFor(pathname: string): { sidebar: NavSection[]; flatPages: NavLink[] } {
	if (!versioned) return { sidebar, flatPages };
	const sb = sidebars.get(activeVersionPath(pathname)) ?? [];
	return { sidebar: sb, flatPages: flattenSections(sb) };
}

/** Rewrite a path to the same page in another version (falls back to its root). */
export function pathInVersion(pathname: string, versionPath: string): string {
	const current = activeVersionPath(pathname);
	const rest = stripBase(pathname).slice(current.length);
	const candidate = `${versionPath}${rest}`;
	const target = sidebars.get(versionPath);
	const exists = target && flattenSections(target).some((p) => stripBase(p.href) === candidate);
	return base + (exists ? candidate : versionPath);
}

export const sidebar = versioned ? (sidebars.get(defaultVersionPath) ?? []) : buildSidebar();
export const flatPages = flattenSections(sidebar);

export { buildSidebar, flattenSections };

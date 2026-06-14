import { base } from '$app/paths';
import type { SiteConfig } from '$lib/types';

const stripBase = (path: string): string =>
	base && path.startsWith(base) ? path.slice(base.length) : path;

const versionPathsOf = (site: SiteConfig): string[] =>
	(site.versions ?? []).map((v) => stripBase(v.href)).filter((href) => href && href !== '/');

export const isVersioned = (site: SiteConfig): boolean => versionPathsOf(site).length > 0;

export const defaultVersionPathOf = (site: SiteConfig): string => versionPathsOf(site)[0] ?? '';

export function pathInVersion(site: SiteConfig, pathname: string, versionPath: string): string {
	const versionPaths = versionPathsOf(site);
	const stripped = stripBase(pathname);
	const current = versionPaths.find((vp) => stripped === vp || stripped.startsWith(`${vp}/`)) ?? '';
	const rest = stripped.slice(current.length);
	if (versionPath === '/') return base + (rest || '/');
	return base + versionPath + (rest === '/' ? '' : rest);
}

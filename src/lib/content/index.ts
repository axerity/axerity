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
	const current =
		versionPaths.find((vp) => stripBase(pathname) === vp || stripBase(pathname).startsWith(`${vp}/`)) ??
		(versionPaths[0] ?? '');
	const rest = stripBase(pathname).slice(current.length);
	return base + `${versionPath}${rest}`;
}

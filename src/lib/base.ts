import { base } from '$app/paths';

/**
 * Prefix an internal absolute link with the configured base path. External
 * links, anchors, and already-prefixed links are returned unchanged. Used by
 * components that render author-written hrefs so they work under a sub-path.
 */
export function withBase(href?: string): string | undefined {
	if (!href || !base) return href;
	if (!href.startsWith('/') || href.startsWith('//') || href.startsWith(`${base}/`)) return href;
	return base + href;
}

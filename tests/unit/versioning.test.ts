import { describe, expect, it } from 'vitest';
import { defaultVersionPathOf, isVersioned, pathInVersion } from '$lib/content/index';
import type { SiteConfig } from '$lib/types';

const site = {
	name: 'X',
	topNav: [],
	versions: [
		{ label: 'v1', href: '/v1' },
		{ label: 'v2', href: '/v2' }
	]
} as unknown as SiteConfig;

describe('versioning', () => {
	it('detects a versioned site', () => {
		expect(isVersioned(site)).toBe(true);
		expect(isVersioned({ name: 'X', topNav: [] } as unknown as SiteConfig)).toBe(false);
	});

	it('uses the first version as the default path', () => {
		expect(defaultVersionPathOf(site)).toBe('/v1');
	});

	it('maps a path from one version into another', () => {
		expect(pathInVersion(site, '/v1/guide/setup', '/v2')).toBe('/v2/guide/setup');
		expect(pathInVersion(site, '/v2/api', '/v1')).toBe('/v1/api');
	});

	it('maps a root version path without a leading double slash', () => {
		const rootSite = {
			name: 'X',
			topNav: [],
			versions: [{ label: 'current', href: '/' }]
		} as unknown as SiteConfig;
		expect(pathInVersion(rootSite, '/getting-started', '/')).toBe('/getting-started');
		expect(pathInVersion(rootSite, '/', '/')).toBe('/');
	});
});

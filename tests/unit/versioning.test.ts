import { describe, expect, it } from 'vitest';
import { defaultVersionPathOf, isVersioned, pathInVersion } from '$lib/content/index';
import type { SiteConfig } from '$lib/types';

const make = (versions?: { label: string; href: string }[]): SiteConfig =>
	({ name: 'X', topNav: [], ...(versions ? { versions } : {}) }) as unknown as SiteConfig;

const versioned = make([
	{ label: 'v1', href: '/v1' },
	{ label: 'v2', href: '/v2' }
]);
const rootOnly = make([{ label: 'current', href: '/' }]);
const mixed = make([
	{ label: 'current', href: '/' },
	{ label: 'v2', href: '/v2' }
]);
const none = make();
const empty = make([]);

describe('isVersioned', () => {
	it('is true when at least one version has a non-root path', () => {
		expect(isVersioned(versioned)).toBe(true);
		expect(isVersioned(mixed)).toBe(true);
	});

	it('is false without versions or with only a root version', () => {
		expect(isVersioned(none)).toBe(false);
		expect(isVersioned(empty)).toBe(false);
		expect(isVersioned(rootOnly)).toBe(false);
	});
});

describe('defaultVersionPathOf', () => {
	it('uses the first non-root version path', () => {
		expect(defaultVersionPathOf(versioned)).toBe('/v1');
		expect(defaultVersionPathOf(mixed)).toBe('/v2');
	});

	it('is empty when there is no versioned path', () => {
		expect(defaultVersionPathOf(none)).toBe('');
		expect(defaultVersionPathOf(empty)).toBe('');
		expect(defaultVersionPathOf(rootOnly)).toBe('');
	});
});

describe('pathInVersion', () => {
	it('maps a path from one version into another', () => {
		expect(pathInVersion(versioned, '/v1/guide/setup', '/v2')).toBe('/v2/guide/setup');
		expect(pathInVersion(versioned, '/v2/api', '/v1')).toBe('/v1/api');
	});

	it('maps a version root to another version root', () => {
		expect(pathInVersion(versioned, '/v1', '/v2')).toBe('/v2');
	});

	it('drops a trailing slash on a version root when switching', () => {
		expect(pathInVersion(versioned, '/v1/', '/v2')).toBe('/v2');
	});

	it('maps a root version path without a leading double slash', () => {
		expect(pathInVersion(rootOnly, '/getting-started', '/')).toBe('/getting-started');
		expect(pathInVersion(rootOnly, '/', '/')).toBe('/');
	});

	it('switches from unversioned root content into a version', () => {
		expect(pathInVersion(mixed, '/guide', '/v2')).toBe('/v2/guide');
	});

	it('switches from a version back to unversioned root content', () => {
		expect(pathInVersion(mixed, '/v2/guide', '/')).toBe('/guide');
		expect(pathInVersion(mixed, '/v2', '/')).toBe('/');
	});

	it('switches from the home page into a version root', () => {
		expect(pathInVersion(mixed, '/', '/v2')).toBe('/v2');
	});

	it('leaves the path untouched when the site has no versions', () => {
		expect(pathInVersion(none, '/getting-started', '/')).toBe('/getting-started');
		expect(pathInVersion(none, '/', '/')).toBe('/');
	});
});

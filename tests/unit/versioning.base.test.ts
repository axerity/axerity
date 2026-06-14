import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({ base: '/docs', assets: '' }));

const { defaultVersionPathOf, isVersioned, pathInVersion } = await import('$lib/content/index');
type SiteConfig = import('$lib/types').SiteConfig;

const make = (versions?: { label: string; href: string }[]): SiteConfig =>
	({ name: 'X', topNav: [], ...(versions ? { versions } : {}) }) as unknown as SiteConfig;

const versioned = make([
	{ label: 'v1', href: '/docs/v1' },
	{ label: 'v2', href: '/docs/v2' }
]);
const rootOnly = make([{ label: 'current', href: '/docs' }]);

describe('versioning under a base path', () => {
	it('keeps the base prefix and strips it for detection', () => {
		expect(isVersioned(versioned)).toBe(true);
		expect(isVersioned(rootOnly)).toBe(false);
		expect(defaultVersionPathOf(versioned)).toBe('/v1');
	});

	it('maps between versions while preserving the base prefix', () => {
		expect(pathInVersion(versioned, '/docs/v1/guide', '/v2')).toBe('/docs/v2/guide');
		expect(pathInVersion(versioned, '/docs/v2', '/v1')).toBe('/docs/v1');
	});

	it('maps a root version path without a leading double slash', () => {
		expect(pathInVersion(rootOnly, '/docs/getting-started', '/')).toBe('/docs/getting-started');
		expect(pathInVersion(rootOnly, '/docs', '/')).toBe('/docs/');
	});

	it('switches into a version from the base home without garbling the path', () => {
		expect(pathInVersion(versioned, '/docs', '/v2')).toBe('/docs/v2');
	});
});

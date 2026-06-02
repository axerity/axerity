import { describe, expect, it } from 'vitest';
import { activeFor } from '$lib/nav-match';

describe('activeFor', () => {
	const tabs = [
		{ title: 'Getting started', href: '/', match: '/' },
		{ title: 'Store', href: '/store/x', match: '/store' },
		{ title: 'Account', href: '/account', match: '/account' }
	];

	it('matches the longest prefix', () => {
		expect(activeFor('/store/analytics', tabs)?.title).toBe('Store');
		expect(activeFor('/account', tabs)?.title).toBe('Account');
		expect(activeFor('/anything-else', tabs)?.title).toBe('Getting started');
	});

	it('uses match over href', () => {
		const items = [{ title: 'Api', href: '/api/landing', match: '/api' }];
		expect(activeFor('/api/v2/intro', items)?.title).toBe('Api');
	});

	it('respects segment boundaries, so /store does not match /storefront', () => {
		const items = [{ title: 'Store', href: '/store', match: '/store' }];
		expect(activeFor('/storefront', items)).toBeUndefined();
		expect(activeFor('/store', items)?.title).toBe('Store');
		expect(activeFor('/store/deep', items)?.title).toBe('Store');
	});
});

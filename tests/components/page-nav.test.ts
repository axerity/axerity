// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import PageNav from '$lib/components/docs/PageNav.svelte';

describe('PageNav', () => {
	it('derives prev and next from the current path', () => {
		const pages = [
			{ title: 'A', href: '/a' },
			{ title: 'B', href: '/' },
			{ title: 'C', href: '/c' }
		];
		const { container } = render(PageNav, { props: { pages } });
		const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
		expect(hrefs).toContain('/a');
		expect(hrefs).toContain('/c');
	});

	it('does not crash when the current page is not in the list', () => {
		const orphan = [
			{ title: 'X', href: '/x' },
			{ title: 'Y', href: '/y' }
		];
		expect(() => render(PageNav, { props: { pages: orphan } })).not.toThrow();
	});
});

// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import TableOfContents from '$lib/components/docs/TableOfContents.svelte';

describe('TableOfContents', () => {
	it('renders the server-provided toc entries as anchor links', () => {
		const toc = [
			{ id: 'intro', title: 'Intro', depth: 2 as const },
			{ id: 'details', title: 'Details', depth: 3 as const }
		];
		const { container, getByText } = render(TableOfContents, { props: { toc } });
		const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
		expect(hrefs).toEqual(['#intro', '#details']);
		expect(getByText('Intro')).toBeTruthy();
	});

	it('indents h3 entries deeper than h2 entries', () => {
		const toc = [
			{ id: 'h2', title: 'Section', depth: 2 as const },
			{ id: 'h3', title: 'Subsection', depth: 3 as const }
		];
		const { container } = render(TableOfContents, { props: { toc } });
		const links = [...container.querySelectorAll('a')];
		expect(links[0].className).toContain('pl-3');
		expect(links[1].className).toContain('pl-6');
	});

	it('renders nothing when there are no entries', () => {
		const { container } = render(TableOfContents, { props: { toc: [] } });
		expect(container.querySelector('nav')).toBeNull();
	});
});

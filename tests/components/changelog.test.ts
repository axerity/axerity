// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import Markdown from '$lib/markdown/Markdown.svelte';
import type { DocNode } from '$lib/markdown/types';

const update = (label: string, tags: string[], body: string): DocNode => ({
	type: 'component',
	name: 'Update',
	props: { label, anchor: label, tags },
	children: [{ type: 'text', value: body }]
});

const tree: DocNode[] = [
	{
		type: 'component',
		name: 'Changelog',
		props: {},
		children: [update('v2', ['Feature'], 'feature body'), update('v1', ['Fix'], 'fix body')]
	}
];

describe('Changelog tag filtering', () => {
	it('collects every tag into a filter bar', () => {
		const { getByRole } = render(Markdown, { props: { nodes: tree } });
		expect(getByRole('button', { name: 'All' })).toBeTruthy();
		expect(getByRole('button', { name: 'Feature' })).toBeTruthy();
		expect(getByRole('button', { name: 'Fix' })).toBeTruthy();
	});

	it('shows only updates that carry the selected tag', async () => {
		const { getByRole, container } = render(Markdown, { props: { nodes: tree } });
		expect(container.textContent).toContain('feature body');
		expect(container.textContent).toContain('fix body');

		await fireEvent.click(getByRole('button', { name: 'Fix' }));
		expect(container.textContent).not.toContain('feature body');
		expect(container.textContent).toContain('fix body');

		await fireEvent.click(getByRole('button', { name: 'All' }));
		expect(container.textContent).toContain('feature body');
		expect(container.textContent).toContain('fix body');
	});

	it('renders updates with no filter bar when used without a Changelog', () => {
		const { container, queryByRole } = render(Markdown, {
			props: { nodes: [update('v1', [], 'lonely body')] }
		});
		expect(container.textContent).toContain('lonely body');
		expect(queryByRole('button', { name: 'All' })).toBeNull();
	});
});

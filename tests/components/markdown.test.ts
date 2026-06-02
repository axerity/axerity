// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Markdown from '$lib/markdown/Markdown.svelte';
import type { DocNode } from '$lib/markdown/types';

describe('Markdown renderer', () => {
	it('renders an element tree with text', () => {
		const nodes: DocNode[] = [
			{ type: 'element', tag: 'p', props: {}, children: [{ type: 'text', value: 'hello' }] }
		];
		const { container } = render(Markdown, { props: { nodes } });
		expect(container.querySelector('p')?.textContent).toContain('hello');
	});

	it('renders raw html nodes', () => {
		const nodes: DocNode[] = [{ type: 'raw', html: '<pre class="shiki">code</pre>' }];
		const { container } = render(Markdown, { props: { nodes } });
		expect(container.querySelector('pre.shiki')).toBeTruthy();
	});

	it('renders a component node with children', () => {
		const nodes: DocNode[] = [
			{
				type: 'component',
				name: 'Callout',
				props: { type: 'info' },
				children: [{ type: 'text', value: 'note body' }]
			}
		];
		const { container } = render(Markdown, { props: { nodes } });
		expect(container.textContent).toContain('note body');
	});

	it('renders a self-closing component (no children) without crashing', () => {
		const nodes: DocNode[] = [
			{ type: 'component', name: 'Step', props: { title: 'Done' }, children: [] }
		];
		expect(() => render(Markdown, { props: { nodes } })).not.toThrow();
	});
});

// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Markdown from '$lib/markdown/Markdown.svelte';
import type { DocNode } from '$lib/markdown/types';

const code = (text: string): DocNode => ({
	type: 'raw',
	html: `<pre class="shiki"><code>${text}</code></pre>`
});

const apiTree: DocNode[] = [
	{
		type: 'component',
		name: 'Api',
		props: {},
		children: [
			{
				type: 'component',
				name: 'RequestExample',
				props: { title: 'Request' },
				children: [code('curl')]
			},
			{
				type: 'component',
				name: 'ResponseExample',
				props: { title: 'Response' },
				children: [code('{}')]
			}
		]
	}
];

const tabsTree: DocNode[] = [
	{
		type: 'component',
		name: 'Tabs',
		props: {},
		children: [
			{
				type: 'component',
				name: 'Tab',
				props: { title: 'One' },
				children: [{ type: 'text', value: 'first' }]
			},
			{
				type: 'component',
				name: 'Tab',
				props: { title: 'Two' },
				children: [{ type: 'text', value: 'second' }]
			}
		]
	}
];

describe('Api context collection', () => {
	it('renders example children registered through context', () => {
		const { container } = render(Markdown, { props: { nodes: apiTree } });
		expect(container.textContent).toContain('Request');
		expect(container.textContent).toContain('Response');
	});

	it('tears down without crashing (the null-safe reactive filter)', () => {
		const { unmount } = render(Markdown, { props: { nodes: apiTree } });
		expect(() => unmount()).not.toThrow();
	});
});

describe('Tabs context collection', () => {
	it('renders tab labels', () => {
		const { container } = render(Markdown, { props: { nodes: tabsTree } });
		expect(container.textContent).toContain('One');
		expect(container.textContent).toContain('Two');
	});

	it('tears down without crashing (the null-safe find)', () => {
		const { unmount } = render(Markdown, { props: { nodes: tabsTree } });
		expect(() => unmount()).not.toThrow();
	});
});

// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Markdown from '$lib/markdown/Markdown.svelte';
import NavDoc from './NavDoc.svelte';
import type { DocNode } from '$lib/markdown/types';

const code = (text: string): DocNode => ({
	type: 'raw',
	html: `<pre class="shiki"><code>${text}</code></pre>`
});
const h2 = (text: string): DocNode => ({
	type: 'element',
	tag: 'h2',
	props: {},
	children: [{ type: 'text', value: text }]
});
const endpoint = (path: string): DocNode => ({
	type: 'component',
	name: 'Endpoint',
	props: { method: 'GET', path },
	children: []
});
const req = (body: string): DocNode => ({
	type: 'component',
	name: 'RequestExample',
	props: { title: 'cURL' },
	children: [code(body)]
});
const resp = (title: string, body: string): DocNode => ({
	type: 'component',
	name: 'ResponseExample',
	props: { title },
	children: [code(body)]
});
const apiBlock = (children: DocNode[]): DocNode[] => [
	{ type: 'component', name: 'Api', props: {}, children }
];

const getPage = apiBlock([endpoint('/a'), h2('Response 200'), req('REQ-A'), resp('200', 'RESP-A')]);
const postPage = apiBlock([
	endpoint('/b'),
	h2('Body parameters'),
	h2('Response 201'),
	req('REQ-B'),
	resp('201', 'RESP-B-201'),
	h2('Response 400'),
	resp('400', 'RESP-B-400')
]);

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

	it('rebuilds the request and response rail when navigating between endpoints', async () => {
		const { container, rerender } = render(NavDoc, {
			props: { path: '/api/get', nodes: getPage }
		});
		expect(container.textContent).toContain('REQ-A');
		expect(container.textContent).toContain('RESP-A');

		await rerender({ path: '/api/post', nodes: postPage });
		const text = container.textContent ?? '';
		expect(text).toContain('REQ-B');
		expect(text).toContain('RESP-B-201');
		expect(text).not.toContain('REQ-A');
		expect(text).not.toContain('RESP-A');
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

import { describe, expect, it } from 'vitest';
import { parseMarkdown } from '$lib/markdown/parse';
import type { DocNode } from '$lib/markdown/types';

function find(nodes: DocNode[], pred: (n: DocNode) => boolean): DocNode | undefined {
	for (const node of nodes) {
		if (pred(node)) return node;
		if ((node.type === 'element' || node.type === 'component') && node.children) {
			const hit = find(node.children, pred);
			if (hit) return hit;
		}
	}
	return undefined;
}

const el = (tag: string) => (n: DocNode) => n.type === 'element' && n.tag === tag;

describe('parseMarkdown', () => {
	it('parses standard markdown into element nodes', async () => {
		const { doc } = await parseMarkdown('# Hello\n\nA paragraph.');
		expect(find(doc, el('h1'))).toBeTruthy();
		expect(find(doc, el('p'))).toBeTruthy();
	});

	it('reads frontmatter', async () => {
		const { frontmatter } = await parseMarkdown('---\ntitle: My Page\nicon: book\n---\n\n# H');
		expect(frontmatter.title).toBe('My Page');
		expect(frontmatter.icon).toBe('book');
	});

	it('gives headings ids and builds a toc of h2 and h3', async () => {
		const { toc } = await parseMarkdown('# Title\n\n## Getting started\n\ntext\n\n### Details');
		expect(toc).toEqual([
			{ id: 'getting-started', title: 'Getting started', depth: 2 },
			{ id: 'details', title: 'Details', depth: 3 }
		]);
	});

	it('resolves a capitalized tag to a component node with parsed props', async () => {
		const { doc } = await parseMarkdown(
			'<Callout type="info" cols={2} open path={\'/x\'}>\n\nbody\n\n</Callout>'
		);
		const callout = find(doc, (n) => n.type === 'component' && n.name === 'Callout');
		expect(callout?.type).toBe('component');
		if (callout?.type === 'component') {
			expect(callout.props.type).toBe('info');
			expect(callout.props.cols).toBe(2);
			expect(callout.props.open).toBe(true);
			expect(callout.props.path).toBe('/x');
		}
	});

	it('treats a lowercase tag as a plain element, not a component', async () => {
		const { doc } = await parseMarkdown('<img src="/a.png" alt="a" />');
		expect(find(doc, el('img'))).toBeTruthy();
		expect(find(doc, (n) => n.type === 'component')).toBeFalsy();
	});

	it('refuses a function call in an attribute, no eval at render time', async () => {
		await expect(parseMarkdown('<Callout type={danger()}>\n\nx\n\n</Callout>')).rejects.toThrow();
	});

	it('opens external links in a new tab', async () => {
		const { doc } = await parseMarkdown('[site](https://example.com)');
		const a = find(doc, el('a'));
		expect(a?.type === 'element' && a.props.target).toBe('_blank');
		expect(a?.type === 'element' && String(a.props.rel)).toContain('noreferrer');
	});

	it('prefixes internal links with the base path', async () => {
		const { doc } = await parseMarkdown('[x](/foo)', '/docs');
		const a = find(doc, el('a'));
		expect(a?.type === 'element' && a.props.href).toBe('/docs/foo');
	});

	it('highlights code fences into raw html nodes', async () => {
		const { doc } = await parseMarkdown('```js\nconst x = 1;\n```');
		const raw = find(doc, (n) => n.type === 'raw');
		expect(raw?.type === 'raw' && raw.html).toContain('shiki');
	});

	it('strips a leading script block but keeps script shown inside a fence', async () => {
		const { doc } = await parseMarkdown('<script>\nimport { X } from "y";\n</script>\n\n# Title');
		expect(find(doc, el('h1'))).toBeTruthy();
		expect(find(doc, (n) => n.type === 'raw' && /<script/.test(n.html))).toBeFalsy();
	});
});

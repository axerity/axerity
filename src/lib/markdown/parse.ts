import * as acorn from 'acorn';
import GithubSlugger from 'github-slugger';
import { mdxJsx } from 'micromark-extension-mdx-jsx';
import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx';
import { toHast } from 'mdast-util-to-hast';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkSmartypants from 'remark-smartypants';
import { unified } from 'unified';
import { parse as parseYaml } from 'yaml';
import type { PageFrontmatter } from '$lib/types';
import { resolveAttributes } from './attr-grammar';
import { highlightCode } from './highlight';
import type { CompiledDoc, DocNode, JsonValue, TocEntry } from './types';

interface AnyNode {
	type: string;
	[key: string]: unknown;
}

function remarkMdxJsx(this: { data: () => Record<string, unknown> }) {
	const data = this.data();
	const micromarkExtensions = (data.micromarkExtensions ??= []) as unknown[];
	const fromMarkdownExtensions = (data.fromMarkdownExtensions ??= []) as unknown[];
	micromarkExtensions.push({ disable: { null: ['codeIndented'] } });
	micromarkExtensions.push(mdxJsx({ acorn, addResult: true }));
	fromMarkdownExtensions.push(mdxJsxFromMarkdown());
}

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkSmartypants)
	.use(remarkFrontmatter, ['yaml'])
	.use(remarkMdxJsx as never);

const SPECIAL: Record<string, string> = {
	className: 'class',
	htmlFor: 'for',
	colSpan: 'colspan',
	rowSpan: 'rowspan',
	tabIndex: 'tabindex',
	srcSet: 'srcset'
};

function attrName(key: string): string {
	if (SPECIAL[key]) return SPECIAL[key];
	if (/^(aria|data)[A-Z]/.test(key)) return key.replace(/([A-Z])/g, '-$1').toLowerCase();
	return key.toLowerCase();
}

function hastProps(properties: Record<string, unknown> | undefined): Record<string, JsonValue> {
	const props: Record<string, JsonValue> = {};
	for (const [key, value] of Object.entries(properties ?? {})) {
		if (value == null || value === false) continue;
		props[attrName(key)] = (Array.isArray(value) ? value.join(' ') : value) as JsonValue;
	}
	return props;
}

const HAST_OPTS = {
	allowDangerousHtml: true,
	passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement']
};

const isMdxJsx = (type: string) => type === 'mdxJsxFlowElement' || type === 'mdxJsxTextElement';

function childrenToDoc(children: AnyNode[] | undefined): DocNode[] {
	return (children ?? []).flatMap(mdastToDoc);
}

function mdastToDoc(node: AnyNode): DocNode[] {
	if (isMdxJsx(node.type)) {
		const name = node.name as string | null;
		const children = childrenToDoc(node.children as AnyNode[]);
		if (!name) return children;
		const attrs = (node.attributes as Parameters<typeof resolveAttributes>[0]) ?? [];
		const props = resolveAttributes(attrs, name);
		if (/^[a-z]/.test(name)) return [{ type: 'element', tag: name, props, children }];
		return [{ type: 'component', name, props, children }];
	}
	if (node.type === 'html') return [{ type: 'raw', html: node.value as string }];
	if (node.type === 'text') return [{ type: 'text', value: node.value as string }];
	if (node.type === 'root') return childrenToDoc(node.children as AnyNode[]);

	if (node.type === 'paragraph') {
		const kids = (node.children as AnyNode[]) ?? [];
		const components = kids.filter((c) => isMdxJsx(c.type));
		const onlyComponents = kids.every(
			(c) => isMdxJsx(c.type) || (c.type === 'text' && !(c.value as string).trim())
		);
		if (components.length && onlyComponents) return components.flatMap(mdastToDoc);
	}

	const hast = toHast(node as never, HAST_OPTS as never) as AnyNode | null | undefined;
	return hast ? hastToDoc(hast) : [];
}

function hastToDoc(node: AnyNode): DocNode[] {
	if (node.type === 'root')
		return ((node.children as AnyNode[] | undefined) ?? []).flatMap(hastToDoc);
	if (node.type === 'text') return [{ type: 'text', value: node.value as string }];
	if (node.type === 'raw') return [{ type: 'raw', html: node.value as string }];
	if (isMdxJsx(node.type)) return mdastToDoc(node);
	if (node.type === 'element') {
		return [
			{
				type: 'element',
				tag: node.tagName as string,
				props: hastProps(node.properties as Record<string, unknown>),
				children: ((node.children as AnyNode[] | undefined) ?? []).flatMap(hastToDoc)
			}
		];
	}
	return [];
}

function textOf(node: DocNode): string {
	if (node.type === 'text') return node.value;
	if (node.type === 'element' || node.type === 'component')
		return node.children.map(textOf).join('');
	return '';
}

interface TransformContext {
	slugger: GithubSlugger;
	toc: TocEntry[];
	basePath: string;
	suppressToc: number;
}

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function transform(nodes: DocNode[], ctx: TransformContext): DocNode[] {
	return nodes.map((node) => {
		if (node.type === 'element') {
			if (node.tag === 'table') {
				return {
					type: 'element',
					tag: 'div',
					props: { class: 'table-wrapper' },
					children: [{ ...node, children: transform(node.children, ctx) }]
				} satisfies DocNode;
			}
			const next = { ...node, children: transform(node.children, ctx) };
			if (HEADINGS.has(next.tag)) {
				if (typeof next.props.id !== 'string') next.props.id = ctx.slugger.slug(textOf(next));
				const depth = Number(next.tag.slice(1));
				if (!ctx.suppressToc && (depth === 2 || depth === 3)) {
					ctx.toc.push({ id: next.props.id as string, title: textOf(next), depth });
				}
			}
			if (next.tag === 'a') {
				const href = next.props.href;
				if (typeof href === 'string') {
					if (/^https?:\/\//.test(href)) {
						next.props.rel = 'noreferrer noopener';
						next.props.target = '_blank';
					} else if (
						ctx.basePath &&
						href.startsWith('/') &&
						!href.startsWith('//') &&
						!href.startsWith(`${ctx.basePath}/`)
					) {
						next.props.href = ctx.basePath + href;
					}
				}
			}
			return next;
		}
		if (node.type === 'component') {
			if (node.name === 'Update') {
				const label = typeof node.props.label === 'string' ? node.props.label : '';
				const title = typeof node.props.title === 'string' ? node.props.title : '';
				const heading = title || label;
				const anchor = heading ? ctx.slugger.slug(heading) : '';
				if (anchor) ctx.toc.push({ id: anchor, title: heading, depth: 2 });
				return {
					...node,
					props: { ...node.props, anchor },
					children: transform(node.children, { ...ctx, suppressToc: ctx.suppressToc + 1 })
				};
			}
			return { ...node, children: transform(node.children, ctx) };
		}
		return node;
	});
}

function cleanRaw(markdown: string): string {
	return markdown
		.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
		.replace(/<script[\s\S]*?<\/script>\s*/g, '')
		.trim();
}

async function highlightAll(tree: AnyNode): Promise<void> {
	const codeNodes: AnyNode[] = [];
	const collect = (node: AnyNode) => {
		if (node.type === 'code') codeNodes.push(node);
		for (const child of (node.children as AnyNode[] | undefined) ?? []) collect(child);
	};
	collect(tree);
	await Promise.all(
		codeNodes.map(async (node) => {
			const result = await highlightCode(
				node.value as string,
				(node.lang as string) ?? '',
				(node.meta as string) ?? ''
			);
			node.type = 'html';
			node.value = result.html;
		})
	);
}

function stripScripts(markdown: string): string {
	const lines = markdown.split('\n');
	const out: string[] = [];
	let fence = '';
	let inScript = false;
	for (const line of lines) {
		const marker = inScript ? null : line.match(/^\s*(`{3,}|~{3,})/)?.[1];
		if (marker) {
			if (!fence) fence = marker;
			else if (marker[0] === fence[0] && marker.length >= fence.length) fence = '';
			out.push(line);
			continue;
		}
		if (fence) {
			out.push(line);
			continue;
		}
		if (!inScript && /^\s*<script[\s>]/.test(line)) {
			inScript = !/<\/script>/.test(line);
			continue;
		}
		if (inScript) {
			if (/<\/script>/.test(line)) inScript = false;
			continue;
		}
		out.push(line);
	}
	return out.join('\n');
}

export async function parseMarkdown(markdown: string, basePath = ''): Promise<CompiledDoc> {
	const source = stripScripts(markdown);
	const tree = processor.runSync(processor.parse(source)) as unknown as AnyNode;

	let frontmatter: PageFrontmatter = {};
	const children = (tree.children as AnyNode[]) ?? [];
	if (children[0]?.type === 'yaml') {
		frontmatter = (parseYaml(children[0].value as string) ?? {}) as PageFrontmatter;
		children.shift();
	}

	await highlightAll(tree);

	const doc = childrenToDoc(children);
	const ctx: TransformContext = { slugger: new GithubSlugger(), toc: [], basePath, suppressToc: 0 };
	const transformed = transform(doc, ctx);

	return { frontmatter, toc: ctx.toc, doc: transformed, raw: cleanRaw(markdown) };
}

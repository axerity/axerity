import type { PageFrontmatter } from '$lib/types';

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export interface TocEntry {
	id: string;
	title: string;
	depth: 2 | 3;
}

export interface ElementNode {
	type: 'element';
	tag: string;
	props: Record<string, JsonValue>;
	children: DocNode[];
}

export interface ComponentNode {
	type: 'component';
	name: string;
	props: Record<string, JsonValue>;
	children: DocNode[];
}

export interface CodeNode {
	type: 'code';
	html: string;
	raw: string;
	lang: string;
	mermaid?: string;
}

export interface TextNode {
	type: 'text';
	value: string;
}

export interface RawNode {
	type: 'raw';
	html: string;
}

export type DocNode = ElementNode | ComponentNode | CodeNode | TextNode | RawNode;

export interface CompiledDoc {
	frontmatter: PageFrontmatter;
	toc: TocEntry[];
	doc: DocNode[];
	raw: string;
}

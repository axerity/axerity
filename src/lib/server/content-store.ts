import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { base } from '$app/paths';
import { parse as parseYaml } from 'yaml';
import { buildSidebar, flattenSections, ROOT } from '$lib/content/tree';
import type { ContentMaps } from '$lib/content/tree';
import { parseMarkdown } from '$lib/markdown/parse';
import type { CompiledDoc } from '$lib/markdown/types';
import type { FolderMeta, NavLink, NavSection, PageFrontmatter } from '$lib/types';

const CONTENT_DIR = resolve(process.env.AXERITY_CONTENT_DIR ?? 'src/content/docs');
const BASE_KEY = `${ROOT}/`;
const DEV = process.env.AXERITY_DEV === '1';

function tryJson<T>(text: string): T | null {
	try {
		return JSON.parse(text) as T;
	} catch {
		return null;
	}
}

function readFrontmatter(text: string): PageFrontmatter {
	const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return {};
	try {
		return (parseYaml(match[1]) ?? {}) as PageFrontmatter;
	} catch {
		return {};
	}
}

function walk(): ContentMaps {
	const pages: Record<string, PageFrontmatter> = {};
	const meta: Record<string, FolderMeta> = {};
	const recurse = (dir: string) => {
		if (!existsSync(dir)) return;
		for (const entry of readdirSync(dir)) {
			const abs = join(dir, entry);
			if (statSync(abs).isDirectory()) {
				recurse(abs);
				continue;
			}
			const rel = relative(CONTENT_DIR, abs).split('\\').join('/');
			const key = `${ROOT}/${rel}`;
			if (entry.endsWith('.md')) pages[key] = readFrontmatter(readFileSync(abs, 'utf8'));
			else if (entry === 'meta.json') {
				const parsed = tryJson<FolderMeta>(readFileSync(abs, 'utf8'));
				if (parsed) meta[key] = parsed;
			}
		}
	};
	recurse(CONTENT_DIR);
	return { pages, meta };
}

interface Tree {
	maps: ContentMaps;
	sidebar: NavSection[];
	flatPages: NavLink[];
}

let cache: Tree | null = null;
function tree(): Tree {
	if (cache && !DEV) return cache;
	const maps = walk();
	const sidebar = buildSidebar(maps);
	const fresh = { maps, sidebar, flatPages: flattenSections(sidebar) };
	if (!DEV) cache = fresh;
	return fresh;
}

export function invalidate(): void {
	cache = null;
	renders.clear();
}

export function getNav(): { sidebar: NavSection[]; flatPages: NavLink[] } {
	const { sidebar, flatPages } = tree();
	return { sidebar, flatPages };
}

export function pathToSlug(key: string): string {
	const rel = key.slice(BASE_KEY.length).replace(/\.md$/, '');
	return rel === 'index' ? '' : rel.replace(/\/index$/, '');
}

export function allSlugs(): string[] {
	return Object.keys(tree().maps.pages).map(pathToSlug);
}

export function allSourcePaths(): string[] {
	return Object.keys(tree().maps.pages).map((key) => key.slice(BASE_KEY.length));
}

function keyForSlug(slug: string): string | null {
	const { pages } = tree().maps;
	const candidates = slug ? [`${BASE_KEY}${slug}.md`, `${BASE_KEY}${slug}/index.md`] : [`${BASE_KEY}index.md`];
	return candidates.find((key) => key in pages) ?? null;
}

export function frontmatterFor(slug: string): PageFrontmatter | undefined {
	const key = keyForSlug(slug);
	return key ? tree().maps.pages[key] : undefined;
}

export function frontmatterByPath(relNoExt: string): PageFrontmatter | undefined {
	return tree().maps.pages[`${BASE_KEY}${relNoExt}.md`];
}

export function allPages(): { slug: string; frontmatter: PageFrontmatter; sourcePath: string }[] {
	return Object.entries(tree().maps.pages).map(([key, frontmatter]) => ({
		slug: pathToSlug(key),
		frontmatter,
		sourcePath: key.slice(BASE_KEY.length)
	}));
}

const renders = new Map<string, (CompiledDoc & { sourcePath: string }) | null>();

export async function render(
	slug: string
): Promise<(CompiledDoc & { sourcePath: string }) | null> {
	if (!DEV && renders.has(slug)) return renders.get(slug)!;
	const key = keyForSlug(slug);
	if (!key) {
		if (!DEV) renders.set(slug, null);
		return null;
	}
	const sourcePath = key.slice(BASE_KEY.length);
	const text = readFileSync(join(CONTENT_DIR, sourcePath), 'utf8');
	const compiled = await parseMarkdown(text, base);
	const result = { ...compiled, sourcePath };
	if (!DEV) renders.set(slug, result);
	return result;
}

function clean(markdown: string): string {
	return markdown
		.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
		.replace(/<script[\s\S]*?<\/script>\s*/g, '')
		.trim();
}

export async function raw(slug: string): Promise<string | null> {
	const key = keyForSlug(slug);
	if (!key) return null;
	const sourcePath = key.slice(BASE_KEY.length);
	return clean(readFileSync(join(CONTENT_DIR, sourcePath), 'utf8'));
}

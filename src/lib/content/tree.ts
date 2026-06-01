/**
 * Content-tree generator.
 *
 */
import { base } from '$app/paths';
import type { FolderMeta, NavEntry, NavLink, NavSection, PageFrontmatter } from '$lib/types';

const ROOT = '/src/content/docs';

const metaModules = import.meta.glob<FolderMeta>('/src/content/docs/**/meta.json', {
	eager: true,
	import: 'default'
});
const pageModules = import.meta.glob<PageFrontmatter>('/src/content/docs/**/*.md', {
	eager: true,
	import: 'metadata'
});

interface PageEntry {
	slug: string;
	frontmatter: PageFrontmatter;
}

function dirOf(path: string): string {
	return path.slice(0, path.lastIndexOf('/'));
}

function slugOf(path: string): string {
	return path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/, '');
}

function hrefFor(folder: string, slug: string): string {
	const rel = folder.slice(ROOT.length);
	if (slug === 'index') return base + (rel || '/');
	return base + rel + '/' + slug;
}

const metaFor = (folder: string): FolderMeta =>
	metaModules[`${folder}/meta.json`] ?? ({} as FolderMeta);

/** Pages grouped by their containing folder. */
function pagesByFolder(): Map<string, Map<string, PageEntry>> {
	const byFolder = new Map<string, Map<string, PageEntry>>();
	for (const [path, frontmatter] of Object.entries(pageModules)) {
		const folder = dirOf(path);
		if (!byFolder.has(folder)) byFolder.set(folder, new Map());
		byFolder.get(folder)!.set(slugOf(path), { slug: slugOf(path), frontmatter: frontmatter ?? {} });
	}
	return byFolder;
}

const byFolder = pagesByFolder();
const allFolders = new Set<string>([...byFolder.keys(), ...Object.keys(metaModules).map(dirOf)]);

/** Folders nested directly inside `folder`. */
function subfoldersOf(folder: string): string[] {
	return [...allFolders].filter((f) => f !== folder && dirOf(f) === folder);
}

function linkFor(folder: string, slug: string): NavLink {
	const { frontmatter } = byFolder.get(folder)!.get(slug)!;
	return {
		title: frontmatter.title ?? slug,
		href: hrefFor(folder, slug),
		icon: frontmatter.icon,
		badge: frontmatter.badge,
		description: frontmatter.description,
		method: frontmatter.method
	};
}

/**
 * Build a folder's entries: its pages (as links) and its subfolders (as nested
 * groups), ordered by `meta.pages` with anything unlisted appended.
 */
function entriesFor(folder: string, includeIndex = true): NavEntry[] {
	const meta = metaFor(folder);
	const pages = byFolder.get(folder) ?? new Map<string, PageEntry>();
	const subfolders = subfoldersOf(folder);
	const subByName = new Map(subfolders.map((f) => [f.slice(f.lastIndexOf('/') + 1), f]));

	const order = meta.pages ?? [];
	const handledPages = new Set<string>();
	const handledSubs = new Set<string>();
	const entries: NavEntry[] = [];

	const pushPage = (slug: string) => {
		if (!includeIndex && slug === 'index') return;
		entries.push(linkFor(folder, slug));
		handledPages.add(slug);
	};

	for (const name of order) {
		if (pages.has(name)) pushPage(name);
		else if (subByName.has(name)) {
			entries.push(groupFor(subByName.get(name)!));
			handledSubs.add(name);
		}
	}

	for (const slug of [...pages.keys()].filter((s) => !handledPages.has(s)).sort()) pushPage(slug);
	for (const [name, path] of subByName) if (!handledSubs.has(name)) entries.push(groupFor(path));

	return entries;
}

function groupFor(folder: string): NavGroupResult {
	const meta = metaFor(folder);
	return {
		title: meta.title ?? folder.slice(folder.lastIndexOf('/') + 1),
		icon: meta.icon,
		items: entriesFor(folder),
		defaultOpen: meta.defaultOpen
	};
}
// Local alias so groupFor reads cleanly above its NavGroup return.
type NavGroupResult = Extract<NavEntry, { items: NavEntry[] }>;

/**
 * Generate the sidebar rooted at a folder: its own pages as a lead section, then
 * each subfolder as a section. Pass a version folder (e.g. `/src/content/docs/v2`)
 * to build that version's sidebar.
 */
export function buildSidebar(rootFolder: string = ROOT): NavSection[] {
	const rootMeta = metaFor(rootFolder);
	const topSubfolders = subfoldersOf(rootFolder);
	const subByName = new Map(topSubfolders.map((f) => [f.slice(f.lastIndexOf('/') + 1), f]));

	// Order top-level folders by the root meta.pages entries that name them.
	const named = (rootMeta.pages ?? [])
		.filter((name) => subByName.has(name))
		.map((name) => subByName.get(name)!);
	const rest = topSubfolders.filter((f) => !named.includes(f)).sort();

	const sections: NavSection[] = [];

	// Lead section: only the root folder's own pages (subfolders are promoted).
	if (byFolder.has(rootFolder)) {
		sections.push({
			title: rootMeta.title ?? 'Docs',
			icon: rootMeta.icon,
			items: entriesFor(rootFolder).filter((entry) => 'href' in entry)
		});
	}

	for (const folder of [...named, ...rest]) {
		const meta = metaFor(folder);
		sections.push({
			title: meta.title ?? folder.slice(folder.lastIndexOf('/') + 1),
			icon: meta.icon,
			items: entriesFor(folder)
		});
	}

	return sections;
}

/** Flatten the sidebar into an ordered list of page links (for prev/next nav). */
export function flattenSections(sections: NavSection[]): NavLink[] {
	const out: NavLink[] = [];
	const walk = (entries: NavEntry[]) => {
		for (const entry of entries) {
			if ('href' in entry) out.push(entry);
			else walk(entry.items);
		}
	};
	for (const section of sections) walk(section.items);
	return out;
}

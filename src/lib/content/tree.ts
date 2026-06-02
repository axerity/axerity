import { base } from '$app/paths';
import type { FolderMeta, NavEntry, NavLink, NavSection, PageFrontmatter } from '$lib/types';

export const ROOT = '/src/content/docs';

export interface ContentMaps {
	pages: Record<string, PageFrontmatter>;
	meta: Record<string, FolderMeta>;
}

interface PageEntry {
	slug: string;
	frontmatter: PageFrontmatter;
}

type NavGroupResult = Extract<NavEntry, { items: NavEntry[] }>;

const dirOf = (path: string): string => path.slice(0, path.lastIndexOf('/'));
const slugOf = (path: string): string => path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/, '');

export function buildSidebar(maps: ContentMaps, rootFolder: string = ROOT): NavSection[] {
	const metaFor = (folder: string): FolderMeta =>
		maps.meta[`${folder}/meta.json`] ?? ({} as FolderMeta);

	const hrefFor = (folder: string, slug: string): string => {
		const rel = folder.slice(ROOT.length);
		if (slug === 'index') return base + (rel || '/');
		return base + rel + '/' + slug;
	};

	const byFolder = new Map<string, Map<string, PageEntry>>();
	for (const [path, frontmatter] of Object.entries(maps.pages)) {
		const folder = dirOf(path);
		if (!byFolder.has(folder)) byFolder.set(folder, new Map());
		byFolder.get(folder)!.set(slugOf(path), { slug: slugOf(path), frontmatter: frontmatter ?? {} });
	}
	const allFolders = new Set<string>([...byFolder.keys(), ...Object.keys(maps.meta).map(dirOf)]);

	const subfoldersOf = (folder: string): string[] =>
		[...allFolders].filter((f) => f !== folder && dirOf(f) === folder);

	const linkFor = (folder: string, slug: string): NavLink => {
		const { frontmatter } = byFolder.get(folder)!.get(slug)!;
		return {
			title: frontmatter.title ?? slug,
			href: hrefFor(folder, slug),
			icon: frontmatter.icon,
			badge: frontmatter.badge,
			description: frontmatter.description,
			method: frontmatter.method
		};
	};

	const entriesFor = (folder: string, includeIndex = true): NavEntry[] => {
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
	};

	const groupFor = (folder: string): NavGroupResult => {
		const meta = metaFor(folder);
		return {
			title: meta.title ?? folder.slice(folder.lastIndexOf('/') + 1),
			icon: meta.icon,
			items: entriesFor(folder),
			defaultOpen: meta.defaultOpen
		};
	};

	const rootMeta = metaFor(rootFolder);
	const topSubfolders = subfoldersOf(rootFolder);
	const subByName = new Map(topSubfolders.map((f) => [f.slice(f.lastIndexOf('/') + 1), f]));

	const named = (rootMeta.pages ?? [])
		.filter((name) => subByName.has(name))
		.map((name) => subByName.get(name)!);
	const rest = topSubfolders.filter((f) => !named.includes(f)).sort();

	const sections: NavSection[] = [];

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

/**
 * Core data shapes for the docs engine.
 *
 */

/** A single navigable page in the sidebar. */
export interface NavLink {
	title: string;
	href: string;
	/** Lucide icon name (see `$lib/icons`). */
	icon?: string;
	badge?: string;
	/** Page description, used by prev/next navigation. */
	description?: string;
	/** HTTP method (API pages) — shown as a badge in the sidebar. */
	method?: string;
}

/** A collapsible, nestable folder in the sidebar. */
export interface NavGroup {
	title: string;
	icon?: string;
	items: NavEntry[];
	/** Expand by default (otherwise collapsed unless it holds the active page). */
	defaultOpen?: boolean;
}

/** Either a page link or a nested group. */
export type NavEntry = NavLink | NavGroup;

/** A top-level titled section in the sidebar (a top-level content folder). */
export interface NavSection {
	title: string;
	icon?: string;
	items: NavEntry[];
}

/** A top-level entry in the global navbar. */
export interface TopNavLink {
	title: string;
	href: string;
	icon?: string;
	match?: string;
	external?: boolean;
}

/** One heading captured for the on-page table of contents. */
export interface TocEntry {
	id: string;
	title: string;
	/** Heading level, 2 = h2, 3 = h3 (h1 is the page title, excluded). */
	depth: 2 | 3;
}

/**
 * Page layout width.
 * - `flat`  — full-bleed; the sidebar sits flush at the left edge (default).
 * - `boxed` — centered within a max-width container on wide screens.
 */
export type LayoutVariant = 'flat' | 'boxed';

export interface Version {
	label: string;
	href: string;
}

export interface Dropdown {
	label: string;
	icon?: string;
	href: string;
	match?: string;
	tabs?: TopNavLink[];
}

export interface Logo {
	light?: string;
	dark?: string;
	alt?: string;
	href?: string;
}

export interface SocialLink {
	icon: string;
	href: string;
	label?: string;
}

export interface FooterConfig {
	note?: string;
	links?: { title: string; href: string }[];
}

export interface Banner {
	text: string;
	href?: string;
	id?: string;
	dismissible?: boolean;
}

export interface AnalyticsConfig {
	plausible?: string;
	googleAnalytics?: string;
}

export interface OgConfig {
	/** Generate a per-page OpenGraph image. Off uses the static `ogImage`. */
	enabled?: boolean;
	background?: string;
	foreground?: string;
	muted?: string;
	accent?: string;
	/** Logo shown in the card. Defaults to the site logo (dark variant). */
	logo?: string;
}

/** Site-wide configuration (the future `docs.json` equivalent). */
export interface SiteConfig {
	name: string;
	tagline?: string;
	description?: string;
	url?: string;
	ogImage?: string;
	og?: OgConfig;
	logo?: Logo;
	topNav: TopNavLink[];
	versions?: Version[];
	dropdowns?: Dropdown[];
	sidebarLinks?: { title: string; href: string }[];
	social?: SocialLink[];
	footer?: FooterConfig;
	banner?: Banner;
	analytics?: AnalyticsConfig;
	editLink?: string;
	github?: string;
	layout?: LayoutVariant;
}

/**
 * `meta.json`
 *
 */
export interface FolderMeta {
	title: string;
	icon?: string;
	pages?: string[];
	/** When this folder is a nested group, expand it by default in the sidebar. */
	defaultOpen?: boolean;
}

/** Frontmatter on a markdown page. */
export interface PageFrontmatter {
	title?: string;
	description?: string;
	icon?: string;
	badge?: string;
	/** `api` switches the page to the wide, TOC-less API reference layout. */
	layout?: 'doc' | 'api';
	/** HTTP method (API pages) — shown as a badge in the sidebar. */
	method?: string;
	/** Publish date (ISO); pages with a date appear in the RSS feed. */
	date?: string;
	/** Last-updated date (ISO), shown near the page footer. */
	updated?: string;
}

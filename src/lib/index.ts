// Public API surface for the docs engine — what the generator core will expose.
export { default as DocsLayout } from './components/docs/DocsLayout.svelte';
export { default as Navbar } from './components/docs/Navbar.svelte';
export { default as Sidebar } from './components/docs/Sidebar.svelte';
export { default as TableOfContents } from './components/docs/TableOfContents.svelte';
export { default as ThemeToggle } from './components/docs/ThemeToggle.svelte';

// Component kit (usable inside markdown).
export { default as Badge } from './components/kit/Badge.svelte';
export { default as Callout } from './components/kit/Callout.svelte';
export { default as Columns } from './components/kit/Columns.svelte';
export { default as Kbd } from './components/kit/Kbd.svelte';
export { default as Update } from './components/kit/Update.svelte';
export { default as Card } from './components/kit/Card.svelte';
export { default as CardGroup } from './components/kit/CardGroup.svelte';
export { default as CodeGroup } from './components/kit/CodeGroup.svelte';
export { default as Accordion } from './components/kit/Accordion.svelte';
export { default as AccordionGroup } from './components/kit/AccordionGroup.svelte';
export { default as Tabs } from './components/kit/Tabs.svelte';
export { default as Tab } from './components/kit/Tab.svelte';
export { default as Steps } from './components/kit/Steps.svelte';
export { default as Step } from './components/kit/Step.svelte';
export { default as Frame } from './components/kit/Frame.svelte';
export { default as Icon } from './components/kit/Icon.svelte';
export { default as Tooltip } from './components/kit/Tooltip.svelte';
export { default as Tree } from './components/kit/Tree.svelte';
export { default as Video } from './components/kit/Video.svelte';
export { default as Folder } from './components/kit/Folder.svelte';
export { default as File } from './components/kit/File.svelte';
export { default as TypeTable } from './components/kit/TypeTable.svelte';
export type { TypeTableProp } from './components/kit/TypeTable.svelte';

// API reference kit.
export { default as Api } from './components/kit/api/Api.svelte';
export { default as Endpoint } from './components/kit/api/Endpoint.svelte';
export { default as ParamField } from './components/kit/api/ApiField.svelte';
export { default as ResponseField } from './components/kit/api/ApiField.svelte';
export { default as RequestExample } from './components/kit/api/RequestExample.svelte';
export { default as ResponseExample } from './components/kit/api/ResponseExample.svelte';
export { default as ObjectExample } from './components/kit/api/ObjectExample.svelte';
export { default as Expandable } from './components/kit/api/Expandable.svelte';
export { default as EnumValues } from './components/kit/api/EnumValues.svelte';
export { default as Enum } from './components/kit/api/Enum.svelte';

export { theme } from './state/theme.svelte';
export type { ThemePreference, ResolvedTheme } from './state/theme.svelte';

// Any Lucide icon by kebab-case name (lazily loaded — no manual registry).
export { default as DynamicIcon } from './components/DynamicIcon.svelte';

// NOTE: the content tree (`sidebar` / `buildSidebar`) is intentionally NOT
// re-exported here. It eagerly globs every markdown file, and markdown files
// import this barrel to use the component kit — re-exporting it would create an
// import cycle (markdown → $lib → content → glob → markdown). Import it from
// `$lib/content` directly instead.

export type {
	SiteConfig,
	LayoutVariant,
	NavSection,
	NavGroup,
	NavEntry,
	NavLink,
	TopNavLink,
	TocEntry,
	FolderMeta,
	PageFrontmatter
} from './types';

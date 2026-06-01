---
title: Layout
description: Control widths, rails, and the page shell.
icon: layout-grid
---

<script>
	import { Callout } from '$lib';
</script>

# Layout

## Flat vs boxed

The overall shell has two modes, set in `src/lib/config/site.ts`:

```ts title="src/lib/config/site.ts"
export const site: SiteConfig = {
	name: 'Axerity',
	layout: 'flat' // 'flat' (full-bleed, sidebar at the edge) or 'boxed' (centered)
};
```

- **`flat`** _(default)_, the sidebar sits flush at the left edge and the shell
  spans the viewport.
- **`boxed`**, the whole shell (navbar + columns) centers in a max-width
  container on wide screens.

## Layout rails

The widths of the shell's columns are tokens in the `@theme` block. Tune them to
taste:

```css title="src/routes/layout.css"
@theme inline {
	--spacing-sidebar: 17rem; /* left navigation */
	--spacing-toc: 15rem; /* right table of contents */
	--spacing-header: 4rem; /* sticky navbar height */
	--spacing-content: 48rem; /* reading width of doc pages */
}
```

`--spacing-content` is the most impactful, it sets the line length of prose.
17rem ≈ 272px sidebar, 48rem ≈ 768px content.

## The API layout

Pages with `layout: api` in their frontmatter switch to a **wide, TOC-less**
two-column layout (content on the left, sticky request/response samples on the
right):

```md title="content/docs/api/get-user.md"
---
title: Get a user
layout: api
---
```

<Callout type="tip">

Set `defaultOpen: true` in a folder's `meta.json` to keep that sidebar group
expanded by default, handy for an API section.

</Callout>

## The three columns

The shell is sidebar / content / table-of-contents. The TOC auto-hides below the
`xl` breakpoint and in API mode; the sidebar collapses into a drawer below `lg`.
The structure lives in `src/lib/components/docs/DocsLayout.svelte` if you need to
restructure it.

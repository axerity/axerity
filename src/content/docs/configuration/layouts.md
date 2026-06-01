---
title: Layouts
description: Page width and the API layout.
icon: layout-grid
---

# Layouts

## Flat and boxed

The whole shell has two modes, set with `layout` in `axerity.json`:

```json title="axerity.json"
{
	"layout": "flat"
}
```

- `flat` (default) is full width. The sidebar sits at the left edge.
- `boxed` centers the shell in a max-width container on wide screens.

## The doc layout

Normal pages use the three column layout: sidebar on the left, content in the
middle, and a table of contents on the right. The table of contents tracks your
scroll position. It hides on narrow screens, and the sidebar becomes a drawer.

## The API layout

Set `layout: api` in a page's frontmatter to switch to the API layout. It is
wider, drops the table of contents, and gives you a two column layout with the
content on the left and sticky request and response examples on the right.

```md
---
title: Create a user
layout: api
---
```

See the [API reference components](/api/pet/pet-object) for what you can
put on these pages.

## On every page

Both layouts include a few things automatically:

- A breadcrumb trail above the title.
- A copy page button. See [AI and LLMs](/configuration/ai).
- Previous and next links at the bottom.
- A footer.

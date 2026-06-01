---
title: Markdown & MDX
description: Write content in Markdown, enhanced with Svelte.
icon: file-text
---

# Markdown & MDX

Axerity renders content with [mdsvex](https://mdsvex.pngwn.io), so every page is
Markdown that can also embed live Svelte components.

## Standard Markdown

All the usual Markdown works, **bold**, _italic_, `inline code`, and
[links](/docs).

- Bullet lists
- With multiple items
- And nested ones

1. Ordered lists
2. Work too

> Blockquotes are styled to match the theme.

## Headings become anchors

Every heading gets an id automatically, which powers the table of contents and
lets you deep-link to any section.

## Tables

Standard Markdown tables are styled as a rounded, scrollable card.

| Feature | Status   |
| ------- | -------- |
| Tables  | Built in |
| Search  | Built in |

## External links

Links to another site open in a new tab automatically. Internal links navigate
in place.

## Components

Import a component in a `<script>` block at the top of the page, then use it
anywhere in the Markdown:

```svelte
<script>
	import { Callout } from '$lib';
</script>

<Callout type="tip">
	Leave a blank line between the tags and the content so the inner Markdown is parsed.
</Callout>
```

The blank line around the content matters. Without it the inner text is treated
as plain text, not Markdown. See the [Components](/docs/components/callout)
section for everything available.

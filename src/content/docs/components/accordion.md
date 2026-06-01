---
title: Accordion
description: Collapsible sections for FAQs and progressive disclosure.
icon: list
---

<script>
	import { Accordion, AccordionGroup } from '$lib';
</script>

# Accordion

Accordions hide secondary content until it's needed, perfect for FAQs, optional
details, and long reference material.

## Single accordion

<Accordion title="What is Axerity?">

Axerity is a documentation site generator for Svelte. You write Markdown and get a
fast static site.

</Accordion>

## Grouped

Wrap multiple accordions in an `<AccordionGroup>` to render them as connected
rows. Pass `open` to expand one by default, and `icon` for a Lucide glyph.

<AccordionGroup>
	<Accordion title="Installation" icon="download" open>

Run `pnpm install` then `pnpm dev`. See [Installation](/docs/installation) for
the full walkthrough.

    </Accordion>
    <Accordion title="Writing content" icon="pencil-line">

Drop Markdown files into `src/content/docs`. Folders become sidebar sections.

    </Accordion>
    <Accordion title="Components" icon="blocks">

Import kit components in a page's `<script>` block and use them inline.

    </Accordion>

</AccordionGroup>

## Usage

```svelte
<script>
	import { Accordion, AccordionGroup } from '$lib';
</script>

<AccordionGroup>
	<Accordion title="Installation" icon="download" open>
		Run `pnpm install` then `pnpm dev`.
	</Accordion>
</AccordionGroup>
```

## Props

| Prop    | Type      | Description                      |
| ------- | --------- | -------------------------------- |
| `title` | `string`  | Header text (required)           |
| `icon`  | `string`  | Optional Lucide icon name        |
| `open`  | `boolean` | Expand by default (uncontrolled) |

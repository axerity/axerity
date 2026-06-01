---
title: Update
description: A timeline entry for changelogs and release notes.
icon: history
---

<script>
	import { Update, Badge } from '$lib';
</script>

# Update

`Update` renders a single entry on a vertical timeline. Stack several to build a
changelog. Pair it with a `date` in the page frontmatter so the page also shows
up in the [RSS feed](/rss.xml).

## Example

<Update label="v1.1.0" date="June 1, 2026">

Added the `Update` component. <Badge color="success">new</Badge>

- Timeline entries with a label and optional date.
- Reads nicely on a dedicated changelog page.

</Update>

<Update label="v1.0.0" date="May 1, 2026">

The first stable release.

</Update>

## Usage

```svelte
<script>
	import { Update } from '$lib';
</script>

<Update label="v1.1.0" date="June 1, 2026">What changed in this release.</Update>
```

## Props

| Prop    | Type     | Description                           |
| ------- | -------- | ------------------------------------- |
| `label` | `string` | Heading, usually a version (required) |
| `date`  | `string` | Optional date shown next to the label |

---
title: Columns
description: Lay content out in a responsive grid.
icon: columns-3
---

<script>
	import { Columns, Card } from '$lib';
</script>

# Columns

Columns place their children in an even grid. On narrow screens the grid
collapses to a single column so nothing gets cramped. Set `cols` to choose how
many columns to show on wider screens.

## Example

<Columns cols={2}>
	<Card title="Fast" icon="zap">Static output that loads instantly.</Card>
	<Card title="Simple" icon="feather">Write Markdown, get a site.</Card>
</Columns>

## Usage

```svelte
<script>
	import { Columns, Card } from '$lib';
</script>

<Columns cols={3}>
	<Card title="One" />
	<Card title="Two" />
	<Card title="Three" />
</Columns>
```

## Props

| Prop   | Type     | Description                                 |
| ------ | -------- | ------------------------------------------- |
| `cols` | `number` | Columns on screens 640px and up (default 2) |

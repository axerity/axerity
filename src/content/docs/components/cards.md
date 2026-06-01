---
title: Cards
description: Rich, tappable cards for links and feature grids.
icon: layout-grid
---

<script>
	import { Card, CardGroup } from '$lib';
</script>

# Cards

Cards present links and information as rich, tappable blocks, great for "next
steps" grids, feature overviews, and navigation.

## Card

A standalone `Card` with an icon, title, and description. Add `href` to make the
whole card a link (it gains a hover state and an arrow):

<Card title="Installation" icon="download" href="/docs/installation">

Get Axerity running locally in a minute.

</Card>

## Card group

Wrap cards in a `CardGroup` to lay them out in a responsive grid. Use `cols` to
set the number of columns:

<CardGroup cols={2}>
	<Card title="Quick Start" icon="rocket" href="/docs/quick-start">

Write your first page in two minutes.

    </Card>
    <Card title="Markdown" icon="file-text" href="/docs/writing/markdown">

Author content in Markdown and Svelte.

    </Card>
    <Card title="Components" icon="blocks" href="/docs/components/callout">

Explore the component kit.

    </Card>
    <Card title="GitHub" icon="code" href="https://github.com/axerity/axerity">

Star the project on GitHub.

    </Card>

</CardGroup>

## Horizontal

Set `horizontal` to place the icon beside the content instead of above it:

<Card title="Configuration" icon="tag" horizontal>

A horizontal card is handy in tighter layouts.

</Card>

## Usage

```svelte
<script>
	import { Card, CardGroup } from '$lib';
</script>

<CardGroup cols={2}>
	<Card title="Quick Start" icon="rocket" href="/docs/quick-start">
		Write your first page in two minutes.
	</Card>
</CardGroup>
```

## Props

| Component   | Prop         | Description                     |
| ----------- | ------------ | ------------------------------- |
| `CardGroup` | `cols`       | Number of columns (default `2`) |
| `Card`      | `title`      | Card heading (required)         |
| `Card`      | `icon`       | Optional Lucide icon name       |
| `Card`      | `href`       | Makes the card a link           |
| `Card`      | `horizontal` | Lay the icon beside the content |

---
title: Icon
description: Drop a Lucide icon inline in a sentence or heading.
icon: flag
---

<script>
	import { Icon } from '$lib';
</script>

# Icon

Use the `Icon` component to place a single glyph anywhere in your text. It pulls
from [Lucide](https://lucide.dev/icons), so any icon name on that site works here.

## Inline

Icons sit on the text baseline, so they read well inside a sentence. Save your
work often <Icon icon="save" /> and ship when the tests pass <Icon icon="check" color="oklch(0.6 0.16 155)" />.

## Sizing

Pass `size` in pixels. The default is 16.

<Icon icon="flag" size={20} /> <Icon icon="flag" size={28} /> <Icon icon="flag" size={36} />

## Color

By default an icon takes the color of the surrounding text. Pass `color` with any
CSS color to override it.

<Icon icon="heart" color="oklch(0.62 0.22 25)" size={24} />
<Icon icon="star" color="oklch(0.7 0.16 75)" size={24} />
<Icon icon="droplet" color="oklch(0.62 0.2 250)" size={24} />

## Usage

```svelte
<script>
	import { Icon } from '$lib';
</script>

Save your work <Icon icon="save" /> often.

<Icon icon="flag" size={32} color="oklch(0.62 0.22 25)" />
```

## Props

| Prop    | Type     | Description                         |
| ------- | -------- | ----------------------------------- |
| `icon`  | `string` | Lucide icon name (required)         |
| `size`  | `number` | Size in pixels (default 16)         |
| `color` | `string` | Any CSS color (defaults to inherit) |

---
title: Colors
description: Change the accent and surface palette.
icon: palette
---

<script>
	import { Callout } from '$lib';
</script>

# Colors

All colors are defined as [oklch](https://oklch.com) values on `:root` and
`.dark` in `src/routes/layout.css`. oklch is `lightness chroma hue`, it keeps
colors perceptually even, which makes building a balanced scale much easier.

## From the config

You do not have to touch CSS to set a brand color. Add a `brand` block to
`axerity.json` and it overrides the active theme's accent and corner radius in
both light and dark:

```json title="axerity.json"
{
	"brand": {
		"accent": "#6d5efc",
		"radius": "0.75rem"
	}
}
```

`accent` takes any CSS color (hex, `rgb()`, `oklch()`). `radius` sets the base
corner rounding. For anything beyond the accent, edit the tokens below.

## Change the accent

The accent drives links, active sidebar items, focus states, and highlights.
Set `--accent` (and its hover / contrast pair) in both themes:

```css title="src/routes/layout.css"
:root {
	--accent: oklch(0.55 0.22 264); /* blue */
	--accent-hover: oklch(0.62 0.2 264);
	--accent-contrast: oklch(0.99 0 0); /* text on a solid accent */
}

.dark {
	--accent: oklch(0.7 0.16 264); /* lighter on dark */
	--accent-hover: oklch(0.76 0.14 264);
	--accent-contrast: oklch(0.18 0.02 264);
}
```

<Callout type="tip">

Use a **lighter, less saturated** accent in dark mode than in light, high
chroma on a dark background is harsh. Bumping lightness by ~0.15 is a good start.

</Callout>

## Change the surfaces

Surfaces and text are neutral by default (`chroma 0`). To tint the whole UI,
say, a cool slate, give every neutral token a small chroma at a shared hue:

```css title="src/routes/layout.css"
.dark {
	--bg: oklch(0.16 0.015 264);
	--bg-subtle: oklch(0.2 0.018 264);
	--surface: oklch(0.21 0.018 264);
	--surface-raised: oklch(0.24 0.02 264);
	--fg: oklch(0.96 0.01 264);
	--fg-muted: oklch(0.72 0.015 264);
	--border: oklch(0.28 0.015 264);
}
```

Keep the **lightness** values close to the defaults, they're tuned for
contrast. Adjust **chroma** and **hue** to set the mood.

## The brand gradient

The signature gradient (used for accents and marks) is one variable:

```css title="src/routes/layout.css"
:root {
	--brand-gradient: linear-gradient(135deg, oklch(0.55 0.22 264), oklch(0.6 0.2 300));
}
```

## Semantic colors

Component accent colors (Callout variants, API method badges) are intentionally
**not** tied to `--accent`, they stay semantic (green = success, red = danger)
so meaning survives any accent change. Adjust them in their components if needed:
`src/lib/components/kit/Callout.svelte` and `…/api/Endpoint.svelte`.

<Callout type="warning">

Always check both light **and** dark after a color change, a value that reads
well on one can fail on the other.

</Callout>

---
title: Advanced
description: Radius, custom tokens, prose, and whole new themes.
icon: sliders
---

<script>
	import { Callout } from '$lib';
</script>

# Advanced theming

Everything you need to take theming as far as you want.

## Roundness

Axerity overrides Tailwind's radius scale in one place, so **every** `rounded-*`
utility across the UI changes at once:

```css title="src/routes/layout.css"
@theme inline {
	--radius-sm: 0.125rem;
	--radius-md: 0.25rem;
	--radius-lg: 0.375rem;
	--radius-xl: 0.5rem;
	--radius-2xl: 0.625rem;
}
```

Want pill-soft corners? Scale these up. Want sharp, terminal-like edges? Set them
all to `0`.

## Make light the default

Axerity defaults to dark. To default to light, change two spots:

```ts title="src/lib/state/theme.svelte.ts"
class ThemeState {
	preference = $state<ThemePreference>('light'); // was 'dark'
}
```

```html title="src/app.html"
<script>
	const pref = localStorage.getItem('axerity-theme') ?? 'light'; // was 'dark'
</script>
```

The second one is the no-flash script that sets the theme **before paint**, keep
it in sync with the default or the page will flash on load.

## Add your own token

Need a new semantic color, say a highlight background? Add it in three steps:

```css title="src/routes/layout.css"
:root {
	--highlight: oklch(0.95 0.05 95);
}
.dark {
	--highlight: oklch(0.3 0.05 95);
}
@theme inline {
	--color-highlight: var(--highlight); /* now usable as bg-highlight, text-highlight */
}
```

## A whole new named theme

The default light/dark live on `:root` and `.dark`. To ship **additional**
themes (e.g. a "sepia" reading mode), override the tokens under a `data-theme`
attribute and set it on `<html>`:

```css title="src/routes/layout.css"
[data-theme='sepia'] {
	--bg: oklch(0.96 0.02 85);
	--surface: oklch(0.98 0.015 85);
	--fg: oklch(0.28 0.03 70);
	--accent: oklch(0.5 0.12 50);
	/* …override the rest of the semantic tokens… */
}
```

```ts title="apply it"
document.documentElement.dataset.theme = 'sepia';
```

Because components read only semantic tokens, a complete new theme is just a new
block of variable values, no component changes.

<Callout type="tip">

This is exactly how the default `.dark` block works. A named theme is the same
idea with a different selector.

</Callout>

## Restyle the prose

Rendered Markdown is styled under `.doc-content` in `src/routes/layout.css`,
headings, links, tables, blockquotes, inline code. Adjust spacing, sizes, or
weights there to change how content reads. For example, tighten heading rhythm:

```css title="src/routes/layout.css"
.doc-content h2 {
	margin-top: 2rem;
	font-size: 1.4rem;
}
```

<Callout type="warning">

Keep edits in `.doc-content` and the token blocks. Touching individual component
files is rarely needed, and makes future updates harder to merge.

</Callout>

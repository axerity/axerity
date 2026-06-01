---
title: Code blocks
description: Change the syntax-highlighting theme.
icon: code
---

<script>
	import { Callout } from '$lib';
</script>

# Code block themes

Code is highlighted with [Shiki](https://shiki.style) using a **dual theme**,
one for light, one for dark, configured in `mdsvex.config.js`.

```js title="mdsvex.config.js"
const themes = { light: 'github-light', dark: 'vesper' };
```

Pick any [bundled Shiki theme](https://shiki.style/themes) for each side:

```js title="mdsvex.config.js"
const themes = { light: 'min-light', dark: 'github-dark-default' };
```

<Callout type="warning">

`mdsvex.config.js` is read at build time, so **restart the dev server** after
changing themes, Vite doesn't hot-reload it.

</Callout>

## Block background

Shiki inlines each theme's own background, but Axerity overrides it with the
`--surface-raised` token so code blocks match cards and panels. That rule is in
`src/routes/layout.css`:

```css title="src/routes/layout.css"
.doc-content pre.shiki {
	background-color: var(--surface-raised) !important;
}
```

Remove the override if you'd rather keep the Shiki theme's native background.

## Languages

Grammars are preloaded in `mdsvex.config.js`. Add any language you use:

```js title="mdsvex.config.js"
const langs = ['svelte', 'typescript', 'javascript', 'json', 'bash', 'css', 'python'];
```

Unlisted languages fall back to plain text.

## Fence options

Authors get titles, line highlighting, and line numbers out of the box:

````md
```ts title="example.ts" {2} showLineNumbers
const a = 1;
const b = 2; // highlighted
```
````

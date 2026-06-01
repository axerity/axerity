---
title: Typography
description: Swap the UI and code fonts.
icon: type
---

<script>
	import { Steps, Step } from '$lib';
</script>

# Typography

Fonts are self-hosted with [Fontsource](https://fontsource.org) and wired through
two tokens: `--font-sans` (UI and content) and `--font-mono` (code). Axerity ships
with **Geist** and **Geist Mono**.

## Where fonts live

The font files are imported in `src/routes/+layout.svelte`:

```svelte title="src/routes/+layout.svelte"
<script lang="ts">
	import '@fontsource-variable/geist/index.css';
	import '@fontsource-variable/geist-mono/index.css';
	import './layout.css';
</script>
```

The tokens that point at them live in `src/routes/layout.css`:

```css title="src/routes/layout.css"
@theme inline {
	--font-sans: 'Geist Variable', ui-sans-serif, system-ui, sans-serif;
	--font-mono: 'Geist Mono Variable', ui-monospace, monospace;
}
```

## Swap a font

<Steps>
	<Step title="Install it">

```bash
pnpm add @fontsource-variable/geist
```

    </Step>
    <Step title="Import the CSS">

In `src/routes/+layout.svelte`, add the import (and drop the old one):

```svelte
<script lang="ts">
	import '@fontsource-variable/geist/index.css';
</script>
```

    </Step>
    <Step title="Point the token at it">

In `src/routes/layout.css`, update the family name (find the exact name in the
package's `index.css`):

```css
@theme inline {
	--font-sans: 'Geist Variable', ui-sans-serif, system-ui, sans-serif;
}
```

    </Step>

</Steps>

## Type declarations

Fontsource CSS imports have no types, so they're declared in `src/app.d.ts`:

```ts title="src/app.d.ts"
declare module '@fontsource-variable/geist/*';
declare module '@fontsource-variable/geist-mono/*';
```

Add a matching line for any new font package.

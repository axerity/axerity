---
title: Extending the kit
description: Adding a component you can use in Markdown.
icon: blocks
---

# Extending the kit

The component kit lives in `src/lib/components/kit/`. These are the components an author can use inside a Markdown page, like `<Callout>` or `<Steps>`. Adding one is three steps.

<Steps>
	<Step title="Create the component">

Add a Svelte component under `src/lib/components/kit/`. It receives its attributes as props and its inner Markdown as a `children` snippet.

```svelte
<script lang="ts">
	let { title, children } = $props();
</script>

<aside class="note">
	<strong>{title}</strong>
	{@render children()}
</aside>
```

    </Step>
    <Step title="Export it">

Export it from `src/lib/index.ts`, the kit's public surface.

```ts
export { default as Note } from './components/kit/Note.svelte';
```

    </Step>
    <Step title="Register the tag">

Map the tag name to the component in `src/lib/markdown/registry.ts`. This is what lets the renderer find it.

```ts
import { Note } from '$lib';

export const registry = { Note /* ...the rest */ };
```

    </Step>

</Steps>

After a `pnpm build:engine`, an author can write `<Note title="Heads up">...</Note>` in any page.

<Callout type="info">

A new component is covered against the self-closing crash the moment it is in the registry, because `tests/components/kit-children.test.ts` renders every registered component with no children. Write a focused test for anything beyond rendering, and pair every bug fix with a regression test.

</Callout>

## How components receive content

A component gets two things. Its attributes arrive as props, parsed into real values by the attribute grammar, so `cols={2}` is the number two and `open` is `true`. Its inner Markdown arrives as a `children` snippet, already rendered, so a component can wrap arbitrary content without knowing what it is.

<Callout type="info">
Lowercase tag names are treated as plain HTML elements, capitalized names as kit components. So `<br>` stays an element and `<Note>` is resolved from the registry.
</Callout>

## Beyond components

The generation endpoints in `src/routes/` (search, sitemap, feeds, OpenGraph images) read from the same `content-store`. If you add a new output, model it as an endpoint that the build crawler can fetch, and add it to the manifest so the crawler writes it.

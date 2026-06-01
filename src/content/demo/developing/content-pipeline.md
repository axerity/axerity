---
title: The content pipeline
description: How a Markdown file becomes a rendered page.
icon: file-code
---

# The content pipeline

This is the heart of the engine. A Markdown file is never compiled into a component. It is parsed into a plain data structure and rendered at request time. Everything in `src/lib/markdown/` exists to do this.

## From file to page

<Steps>
	<Step title="Read and parse">

`content-store.render(slug)` reads the file from disk and hands it to `parse.ts`. The parser runs remark with the JSX syntax extension, so standard Markdown becomes elements and `<Component>` tags become component nodes.

	</Step>
	<Step title="Build a document model">

The parser returns a `DocNode` tree. It is plain JSON, with no functions or component references, so it can be serialized.

	</Step>
	<Step title="Return as load data">

`+page.server.ts` returns that tree. It travels to the browser as page data, which is what lets interactive components hydrate.

	</Step>
	<Step title="Render">

`Markdown.svelte` walks the tree and renders each node. Component nodes are looked up by name in `registry.ts`.

	</Step>
</Steps>

## The document model

A node is one of a small set of shapes, defined in `types.ts`:

```ts
type DocNode =
	| { type: 'element'; tag: string; props: object; children: DocNode[] }
	| { type: 'component'; name: string; props: object; children: DocNode[] }
	| { type: 'text'; value: string }
	| { type: 'raw'; html: string };
```

An `element` is a plain HTML tag. A `component` is a kit component. A `raw` node holds pre rendered HTML, which is how highlighted code blocks are carried.

## Parsing details

The parser reuses the standard Markdown to HTML conversion for everything except component tags. When it reaches a `<Component>` tag it stops, reads the attributes, and recurses into the children. This keeps standard Markdown faithful while letting components nest Markdown inside them.

<Callout type="info">
Component attributes are read by `attr-grammar.ts`, which understands strings, numbers, booleans, arrays, and object literals, but never runs code. An attribute can express data, not logic, which keeps content safe to render.
</Callout>

Code fences are highlighted by `highlight.ts` at parse time, using Shiki. The result is stored as a `raw` node, so the renderer never has to highlight anything itself.

## Rendering

`Markdown.svelte` is a small recursive component. For an element node it emits the tag. For a component node it looks up `registry.ts` and renders the component, passing the parsed attributes as props and the children as a snippet. Lowercase tag names are treated as plain HTML, capitalized names as kit components.

Because the renderer only ever reads data, the same tree renders identically on the server and in the browser.

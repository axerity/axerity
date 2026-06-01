---
title: Dev and build
description: How the CLI drives the prebuilt server.
icon: terminal
---

# Dev and build

The CLI in `bin/axerity.js` does not run a bundler. It points the prebuilt server at a project's content and runs one of the small scripts in `runtime/`.

## Two kinds of edits

This is the single most important thing to understand while developing.

<Callout type="warning">
Editing content reloads instantly. Editing engine code needs a recompile, because the server is prebuilt.
</Callout>

| You change | What to do |
| --- | --- |
| Content or config (`src/content/demo`, `axerity.json`) | Nothing. The dev server live reloads. |
| Engine code (anything in `src`, a route, a component) | Run `pnpm build:engine`, or restart `pnpm dev`. |

## Dev

`runtime/serve.js` wraps `dist/` in a small Node HTTP server. A file watcher tracks the content folder and the config. When something changes it pushes a reload event over a Server Sent Events stream, and the page in the browser refreshes. Because content is read from disk on each request, the server always reflects the current files. There is no rebuild and no bundler.

The live reload script is injected into the page by a server hook, only when running in dev, so production output stays clean.

## Build

`runtime/crawl.js` produces the static site.

<Steps>
	<Step title="Boot the server in process">

It imports the compiled handler from `dist/` and starts it on a local port. No socket needs to be exposed.

	</Step>
	<Step title="Ask for the route list">

It fetches an internal manifest endpoint that returns every page, raw Markdown file, OpenGraph image, and feed to generate.

	</Step>
	<Step title="Fetch and write">

It requests each route from the in process server and writes the response to `./build`, then copies the client assets across.

	</Step>
</Steps>

The result is a plain folder of HTML and assets that hosts anywhere. The same compiled server powers both dev and build, so there is only ever one rendering path to reason about.

## Commands

```bash
pnpm dev            # serve the demo at http://localhost:5173
pnpm build          # crawl to a static site in ./build
pnpm preview        # serve ./build at http://localhost:4173
pnpm build:engine   # compile the engine to ./dist
pnpm check          # type check
pnpm lint           # prettier and eslint
```

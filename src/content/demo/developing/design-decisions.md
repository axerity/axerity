---
title: Design decisions
description: The choices that shape the engine, and the tradeoffs behind them.
icon: compass
---

# Design decisions

Most of Axerity follows from a handful of decisions. This page records what they are, the problem each one solves, and what it costs. If you are changing the engine, read this first, because a change that fights one of these will feel awkward for a reason.

## Ship a prebuilt engine, not source

The earlier version shipped its source and ran a bundler inside your project on every command. The bundler then had to resolve the whole framework through whatever layout your package manager produced. Symlinked stores, dependency scanners, and file allow lists all became failure points, and they failed differently on every machine.

The decision was to stop assembling the framework in your environment. The engine is compiled once with Vite, in CI, before publish. What ships is `dist/`, a self contained server.

<Callout type="info">

The tradeoff: changing engine code now needs a recompile, because the thing that runs is the compiled output, not the source. You cannot hot edit the engine from inside a project that installed it. In return, a build never depends on how your package manager laid out `node_modules`, and the dev server starts instantly because there is no bundler in the serving path.

</Callout>

Everything else on this page exists to make a prebuilt engine possible.

## Treat content as data, not code

A prebuilt server cannot compile a new Svelte component for every Markdown file, because compilation is exactly the step we moved into CI. So a Markdown file is never turned into a component. It is parsed into a plain JSON document model and rendered by one fixed renderer.

<CardGroup cols={2}>
	<Card title="What this buys" icon="check">

The document model is serializable, so it travels to the browser as page data and hydrates. There is one rendering path to reason about, on the server and in the client, and no per page compilation.

	</Card>
	<Card title="What it costs" icon="x">

You cannot drop arbitrary Svelte or JavaScript into a page. Authoring is data and a known set of components, not a programming surface.

	</Card>
</CardGroup>

Real content almost never needs to be a program, so this trade has been worth it many times over. When a page does need behavior, that behavior lives in a kit component, written once in the engine.

## Read attributes as data, never run them

A component attribute like `cols={2}` or `path={'/pets/{id}'}` is real syntax that has to be understood. The grammar in `attr-grammar.ts` parses the expression into an ESTree and walks it into plain JSON. It accepts strings, numbers, booleans, null, arrays, and object literals. It throws on anything that is code, such as a function call or a bare identifier.

<Callout type="warning">

This is deliberate, not a limitation we have not gotten around to. Content expresses data, not logic. An attribute can never call a function or read a variable, so a Markdown file can never run arbitrary code at render time. That property is what lets the engine parse `<Component attr={...}>` without an evaluator and without a bundler.

</Callout>

## Resolve components through a fixed registry

Component tags are mapped to kit components by name in `registry.ts`. The renderer looks a tag up there. It does not import anything from your project.

This keeps the surface predictable and safe. The components are known, they ship already compiled, and there is no path by which a page pulls in code to execute. The cost is that an author cannot define their own Svelte component in a project. To add one you extend the engine and republish, which is the right place for it to live. A lighter plugin surface is on the roadmap for cases where that is too heavy.

## Read config at request time

`axerity.json` is read from disk when a request comes in, not baked into the build. `getSite()` caches it in production and rereads it in dev. The same compiled server can therefore serve any project, and changing config is a reload, not a rebuild. Theme and brand are injected into the page by a server hook that rewrites the HTML per request, so one binary themes itself from data.

## One server for dev and build

The engine is an `adapter-node` server. The build does not prerender through a separate path. It boots that same server in process and crawls it, fetching every route and writing the response to disk.

<Callout type="info">

There is only ever one rendering path. A page renders the same way whether you are editing it in dev or shipping it in a build, so a bug cannot hide in a second code path that only runs at build time. The cost is that a build is a crawl rather than a compile, which is simple and predictable but means the server is always the source of truth for what exists.

</Callout>

## Highlight on the server, load languages on demand

Syntax highlighting runs when content is parsed, on the server, and the result is stored as ready HTML. The client never highlights anything, so Shiki and its grammars stay out of the browser bundle. Common languages are prebundled for instant use, and any other language Shiki supports is loaded the first time a page needs it. Nothing falls back to plain text, and nothing unused is paid for up front.

## Fail the build instead of shipping a broken page

If a route errors during a crawl, the build records it, prints a readable summary, and exits non-zero. It does not write the error page and call the build a success.

<Callout type="warning">

A green build that quietly shipped a broken page is worse than a red one. The crawler checks every response, the server hook logs one clean line per failure instead of a stack trace, and a single bad page fails the whole build so it gets fixed rather than deployed.

</Callout>

## Keep reactive collection null safe

Some components collect their children through context. A child registers itself into a `$state` array on mount and removes itself on destroy, and the parent filters that array in a `$derived`. During navigation teardown that array can briefly contain a hole.

The rule that comes out of this: every such filter must be null safe, for example `examples.filter((e) => e?.kind === 'request')`. An uncaught error thrown inside a reactive derivation does not just break one component. It halts the client reactivity graph for the rest of the session, so unrelated things like the on this page links or the prev and next buttons silently stop updating. This was a real and slow to find bug, and the discipline that prevents it is cheap.

## Serve project assets with no build step

Images, logos, and other static files are served straight from the project, filtered to a safe set of extensions with a path containment guard. The same helper streams them in dev and copies them into the build. A logo or a screenshot works in dev and in production with no configuration and no separate assets pipeline.

## Where to go next

<CardGroup cols={2}>
	<Card title="The content pipeline" icon="file-code" href="/developing/content-pipeline">

How a Markdown file becomes a document model.

	</Card>
	<Card title="Rendering and components" icon="blocks" href="/developing/rendering">

How the model becomes UI, and how the kit handles state.

	</Card>
	<Card title="The runtime" icon="terminal" href="/developing/runtime">

How the CLI drives the prebuilt server.

	</Card>
	<Card title="Architecture" icon="layers" href="/developing">

The short version of the model.

	</Card>
</CardGroup>

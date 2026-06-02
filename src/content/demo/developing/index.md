---
title: Architecture
description: How the Axerity engine is built and why.
icon: layers
---

# Architecture

This section is about the engine itself, the source published to npm as `@axerity/cli`. It is for people working on Axerity, not for people writing docs with it.

## The model

Axerity is a prebuilt server. Most documentation generators ship their source and assemble the framework on your machine every time you run them. Axerity does that work once.

<Steps>
	<Step title="Compile once">

The engine source is compiled into `dist/` with Vite. This is the only time a bundler runs, and it happens in CI before publish, never on a user's machine.

    </Step>
    <Step title="Serve content as data">

`dist/` is a self contained server built with `adapter-node`. It reads a project's Markdown and config from the filesystem at request time, rather than baking them in at build time.

    </Step>
    <Step title="Drive it with the CLI">

The CLI runs that prebuilt server. `dev` wraps it for local editing, `build` crawls it into a static site. No bundler runs in your project either way.

    </Step>

</Steps>

## Why it is built this way

The earlier model ran Vite inside the user's project on every command. That meant the bundler had to resolve the whole framework through whatever layout the user's package manager produced. Symlinked stores, dependency scanners, and file allow lists all became failure points.

<Callout type="info">
The fix was to stop assembling the framework in the user's environment. Content became data instead of code, so a Markdown file is parsed into a JSON document model and rendered by a fixed component kit. There is no per page compilation and no `import.meta.glob`.
</Callout>

This is what makes the dev server start instantly and never choke on a package manager quirk. There is no bundler in the serving path to choke.

## Where to go next

<CardGroup cols={2}>
	<Card title="The content pipeline" icon="file-code" href="/developing/content-pipeline">
		How a Markdown file becomes a rendered page.
	</Card>
	<Card title="Dev and build" icon="terminal" href="/developing/dev-and-build">
		How the CLI drives the prebuilt server.
	</Card>
	<Card title="Extending the kit" icon="blocks" href="/developing/extending">
		Adding a component you can use in Markdown.
	</Card>
	<Card title="Releasing" icon="package" href="/developing/releasing">
		How a version is cut and published.
	</Card>
</CardGroup>

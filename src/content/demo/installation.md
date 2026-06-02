---
title: Installation
description: Get Axerity running locally in a minute.
icon: download
---

# Installation

Axerity is a CLI. You do not clone or fork anything. Run it, scaffold a site, and
start writing Markdown.

## Requirements

- Node.js 24 or newer

## Create a site

Scaffold a new site with `init`, then start the dev server:

<CodeGroup>

```bash title="pnpm"
pnpm dlx @axerity/cli init my-docs
cd my-docs
pnpm dlx @axerity/cli dev
```

```bash title="npm"
npx @axerity/cli init my-docs
cd my-docs
npx @axerity/cli dev
```

```bash title="bun"
bunx @axerity/cli init my-docs
cd my-docs
bunx @axerity/cli dev
```

</CodeGroup>

Your site is running at `http://localhost:5173`.

## Run any command

Run every command the same way, straight through your package runner. There is
no install step and no `package.json` to maintain, so your repo stays just
content and config:

<CodeGroup>

```bash title="pnpm"
pnpm dlx @axerity/cli dev
pnpm dlx @axerity/cli build
pnpm dlx @axerity/cli preview
```

```bash title="npm"
npx @axerity/cli dev
npx @axerity/cli build
npx @axerity/cli preview
```

```bash title="bun"
bunx @axerity/cli dev
bunx @axerity/cli build
bunx @axerity/cli preview
```

</CodeGroup>

`dev` starts the dev server, `build` writes the static site to `./build`, and
`preview` serves that build locally. This is the setup we recommend. It is also
all you need to deploy: point your host's build command at `npx @axerity/cli build`
and set the output directory to `build`.

## Pin a version

Prefer a `package.json`? Add Axerity as a dev dependency so the version is
pinned, then call it through scripts:

<CodeGroup>

```bash title="pnpm"
pnpm add -D @axerity/cli
```

```bash title="npm"
npm install -D @axerity/cli
```

```bash title="bun"
bun add -d @axerity/cli
```

</CodeGroup>

```json title="package.json"
{
	"scripts": {
		"dev": "axerity dev",
		"build": "axerity build",
		"preview": "axerity preview"
	}
}
```

Now `pnpm dev` and `pnpm build` run the pinned version.

## Project layout

A site is your content and one config file:

```
my-docs/
  axerity.json     site configuration
  docs/            your markdown + meta.json
  public/          optional images and assets
```

Write Markdown in `docs/`, order pages with `meta.json`, and configure the site
in [`axerity.json`](/configuration). The engine runs from its own install, so the
only thing Axerity ever creates in your project is the `build/` folder. The
scaffold adds it to your `.gitignore` for you.

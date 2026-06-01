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

```bash
pnpm dlx @axerity/cli init my-docs
cd my-docs
pnpm dlx @axerity/cli dev
```

Your site is running at `http://localhost:5173`. `pnpm dlx` runs the CLI without
installing it. `npx @axerity/cli <command>` works the same way.

## Install it

For a project you build often, add it as a dev dependency so the version is
pinned:

```bash
pnpm add -D @axerity/cli
```

Then wire up scripts in your `package.json`:

```json
{
  "scripts": {
    "dev": "axerity dev",
    "build": "axerity build",
    "preview": "axerity preview"
  }
}
```

Now `pnpm dev` and `pnpm build` just work, no global install or PATH setup.

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

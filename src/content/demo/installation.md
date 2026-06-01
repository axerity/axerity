---
title: Installation
description: Get Axerity running locally in a minute.
icon: download
---

# Installation

Axerity is a CLI. You do not clone or fork anything. Install it, scaffold a site,
and start writing Markdown.

## Requirements

- Node.js 20 or newer

## Create a site

Scaffold a new site with `init`, then start the dev server:

```bash
npx axerity init my-docs
cd my-docs
npx axerity dev
```

Your site is running at `http://localhost:5173`. Or install it globally and drop
the `npx`:

```bash
npm install -g axerity
axerity init my-docs
```

## Project layout

A site is just your content and one config file. Everything else lives in the
package:

```
my-docs/
  axerity.json     site configuration
  docs/            your markdown + meta.json
  public/          optional images and assets
```

Write Markdown in `docs/`, order pages with `meta.json`, and configure the site
in [`axerity.json`](/configuration). The CLI builds a hidden `.axerity`
workspace to run the engine against your content, so add `.axerity` to your
`.gitignore` (the scaffold does this for you).

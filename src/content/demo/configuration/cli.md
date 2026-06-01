---
title: CLI
description: The axerity command.
icon: code
---

# CLI

The `axerity` command scaffolds, runs, and builds your site. It carries the whole
engine, so your project only holds content and config.

## Commands

```bash
axerity init [dir]   # scaffold a new site (defaults to the current folder)
axerity dev          # start the dev server
axerity build        # build the static site
axerity preview      # preview the production build
```

Run them with `pnpm dlx @axerity/cli <command>` (or `npx @axerity/cli <command>`),
or add `@axerity/cli` as a dev dependency and call `axerity` through your scripts.

## init

`axerity init my-docs` creates a starter site: an `axerity.json`, a `docs/`
folder with a couple of pages and a `meta.json`, and a `.gitignore`. Leave off
the folder name to scaffold into the current directory.

## dev

`axerity dev` serves your site with live reload. Editing a Markdown file or
`axerity.json` updates the browser immediately. Pass through any Vite flag, for
example `axerity dev --port 4000`.

## build

`axerity build` produces a static site in `build/`. Every page is prerendered to
HTML, and the search index, `llms.txt`, sitemap, RSS feed, and OpenGraph images
are all written out, ready to host anywhere.

## How it works

The engine runs from its own install, not from your repo. When you run a command,
Axerity reads your `docs/` and `axerity.json` and renders against them, then
writes the result to `build/` in your project. Your content is the source of
truth and nothing else in your folder is touched, so there is no workspace to
gitignore beyond `build/`.

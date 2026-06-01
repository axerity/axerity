---
title: CLI
description: The axerity command.
icon: code
---

# CLI

Axerity comes with a small command line tool for running and building the site.

## Commands

```bash
axerity dev       # start the dev server
axerity build     # build the static site
axerity preview   # preview the production build
```

You can also run them through your package manager:

```bash
pnpm axerity build
```

## The build

`axerity build` produces a static site. Every page is prerendered to HTML, the
search index and `.md` files are written out, and the result drops into the
build output ready to host anywhere.
